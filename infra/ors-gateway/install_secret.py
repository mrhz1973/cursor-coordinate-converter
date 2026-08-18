#!/usr/bin/env python3
"""Install ORS_API_KEY on VPS via masked terminal input, then enable LoadCredential.

Secret travels only on SSH stdin. Never printed, never in argv/env/files locally.
After a successful write: install canonical drop-in, daemon-reload, restart, verify PRESENT.
"""
from __future__ import annotations

import getpass
import subprocess
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent
DROPIN_SRC = SRC / "goi-ors-gateway.service.d" / "credential.conf"
DROPIN_DST = "/etc/systemd/system/goi-ors-gateway.service.d/credential.conf"
LOADCRED_LINE = "LoadCredential=ORS_API_KEY:/etc/systemd/ors-credentials/ORS_API_KEY"

# Single remote shell. No python3 -c. No secret interpolation.
# stdin is consumed only by `cat > KEY`; later phases never dump the file.
SSH_REMOTE = (
    "set -e; "
    "CRED=/etc/systemd/ors-credentials; KEY=$CRED/ORS_API_KEY; "
    "DROPDIR=/etc/systemd/system/goi-ors-gateway.service.d; "
    "DROP=$DROPDIR/credential.conf; "
    "if command -v sudo >/dev/null 2>&1 && [ \"$(id -u)\" -ne 0 ]; then SUDO=sudo; else SUDO=; fi; "
    "$SUDO install -d -m 700 \"$CRED\"; "
    "umask 077; "
    "$SUDO rm -f \"$KEY\"; "
    "$SUDO sh -c 'umask 077; cat > /etc/systemd/ors-credentials/ORS_API_KEY'; "
    "ec=$?; "
    "if [ \"$ec\" -ne 0 ]; then $SUDO rm -f \"$KEY\"; echo SECRET_INSTALL_FAIL phase=cat; exit 1; fi; "
    "$SUDO chmod 600 \"$KEY\"; "
    "$SUDO chown root:root \"$KEY\"; "
    "if [ ! -f \"$KEY\" ] || [ ! -s \"$KEY\" ]; then $SUDO rm -f \"$KEY\"; echo SECRET_INSTALL_FAIL phase=empty; exit 1; fi; "
    "$SUDO install -d -m 0755 \"$DROPDIR\"; "
    "if [ -f /tmp/goi-ors-gw/credential.conf ]; then "
    "$SUDO install -o root -g root -m 0644 /tmp/goi-ors-gw/credential.conf \"$DROP\"; "
    "else "
    "$SUDO sh -c 'printf \"%s\\n\" \"[Service]\" \"" + LOADCRED_LINE + "\" > /etc/systemd/system/goi-ors-gateway.service.d/credential.conf'; "
    "$SUDO chmod 0644 \"$DROP\"; "
    "fi; "
    "if ! grep -q 'LoadCredential=ORS_API_KEY:/etc/systemd/ors-credentials/ORS_API_KEY' \"$DROP\"; then echo SECRET_INSTALL_FAIL phase=dropin; exit 1; fi; "
    "$SUDO systemctl daemon-reload; "
    "if ! $SUDO systemctl restart goi-ors-gateway.service; then echo SECRET_INSTALL_FAIL phase=restart; exit 1; fi; "
    "sleep 1; "
    "if [ \"$(systemctl is-active goi-ors-gateway.service)\" != \"active\" ]; then echo SECRET_INSTALL_FAIL phase=inactive; exit 1; fi; "
    "STJSON=$(curl -fsS --max-time 5 http://127.0.0.1:8020/ors/status || true); "
    "case \"$STJSON\" in "
    "*'\"secret\": \"PRESENT\"'*) echo SECRET_PRESENT_OK ;; "
    "*) echo SECRET_INSTALL_FAIL phase=status-not-present; exit 1 ;; "
    "esac; "
    "echo SECRET_INSTALL_OK"
)


def ssh_argv() -> list[str]:
    return ["ssh", "-o", "LogLevel=ERROR", "ionos-n8n", SSH_REMOTE]


def stage_dropin() -> None:
    if not DROPIN_SRC.is_file():
        raise SystemExit("SECRET_INSTALL_FAIL phase=dropin-src")
    txt = DROPIN_SRC.read_text(encoding="utf-8")
    if LOADCRED_LINE not in txt:
        raise SystemExit("SECRET_INSTALL_FAIL phase=dropin-src")
    subprocess.run(["ssh", "-o", "LogLevel=ERROR", "ionos-n8n", "mkdir", "-p", "/tmp/goi-ors-gw"], check=True)
    subprocess.run(
        ["scp", "-o", "LogLevel=ERROR", str(DROPIN_SRC), "ionos-n8n:/tmp/goi-ors-gw/credential.conf"],
        check=True,
    )


def main() -> int:
    argv = ssh_argv()
    if any("python3" in a and "-c" in a for a in argv):
        sys.stderr.write("SECRET_INSTALL_FAIL phase=argv-python-c\n")
        return 3
    if "python3 -c" in SSH_REMOTE:
        sys.stderr.write("SECRET_INSTALL_FAIL phase=remote-python-c\n")
        return 3
    if LOADCRED_LINE not in SSH_REMOTE or "daemon-reload" not in SSH_REMOTE:
        sys.stderr.write("SECRET_INSTALL_FAIL phase=wiring-missing\n")
        return 3

    try:
        stage_dropin()
    except Exception:
        sys.stderr.write("SECRET_INSTALL_FAIL phase=stage-dropin\n")
        return 6

    try:
        sys.stdout.write("ORS_API_KEY: ")
        sys.stdout.flush()
        if sys.platform == "win32":
            import msvcrt

            chars: list[str] = []
            while True:
                ch = msvcrt.getwch()
                if ch in ("\r", "\n"):
                    sys.stdout.write("\n")
                    sys.stdout.flush()
                    break
                if ch == "\x03":
                    raise KeyboardInterrupt
                if ch in ("\b", "\x08"):
                    if chars:
                        chars.pop()
                    continue
                if ch in ("\x00", "\xe0"):
                    msvcrt.getwch()
                    continue
                chars.append(ch)
            key = "".join(chars)
        else:
            key = getpass.getpass("")
    except (EOFError, KeyboardInterrupt):
        sys.stderr.write("SECRET_INSTALL_FAIL phase=abort\n")
        return 1
    if not key or not str(key).strip():
        sys.stderr.write("SECRET_INSTALL_FAIL phase=empty-input\n")
        return 2

    payload = str(key).strip().encode("utf-8")
    key = None
    del key

    try:
        r = subprocess.run(
            argv,
            input=payload,
            check=False,
            shell=False,
            capture_output=True,
        )
    except Exception:
        payload = b""
        sys.stderr.write("SECRET_INSTALL_FAIL phase=ssh\n")
        return 4
    payload = b""

    out = (r.stdout or b"").decode("utf-8", errors="replace")
    err = (r.stderr or b"").decode("utf-8", errors="replace")
    combined = (out + "\n" + err).strip()
    if r.returncode != 0 or "SECRET_INSTALL_OK" not in combined:
        phase = "remote"
        if "phase=" in combined:
            for tok in combined.replace("\n", " ").split():
                if tok.startswith("phase="):
                    phase = tok.split("=", 1)[-1]
                    break
        sys.stderr.write("SECRET_INSTALL_FAIL phase=%s\n" % phase)
        return r.returncode or 5
    sys.stderr.write("SECRET_INSTALL_OK\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
