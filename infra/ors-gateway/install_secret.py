#!/usr/bin/env python3
"""Install ORS_API_KEY on VPS via masked terminal input.

Secret travels only on SSH stdin. Never printed, never in argv/env/files locally.
"""
from __future__ import annotations

import getpass
import subprocess
import sys

# Single remote shell line. No python3 -c. No secret interpolation.
SSH_REMOTE = (
    "set -e; "
    "CRED=/etc/systemd/ors-credentials; KEY=$CRED/ORS_API_KEY; "
    "if command -v sudo >/dev/null 2>&1 && [ \"$(id -u)\" -ne 0 ]; then SUDO=sudo; else SUDO=; fi; "
    "$SUDO install -d -m 700 \"$CRED\"; "
    "umask 077; "
    "$SUDO rm -f \"$KEY\"; "
    "$SUDO sh -c 'umask 077; cat > /etc/systemd/ors-credentials/ORS_API_KEY'; "
    "ec=$?; "
    "if [ \"$ec\" -ne 0 ]; then $SUDO rm -f \"$KEY\"; echo SECRET_INSTALL_FAIL phase=cat; exit 1; fi; "
    "$SUDO chmod 600 \"$KEY\"; "
    "if [ ! -f \"$KEY\" ] || [ ! -s \"$KEY\" ]; then $SUDO rm -f \"$KEY\"; echo SECRET_INSTALL_FAIL phase=empty; exit 1; fi; "
    "echo SECRET_INSTALL_OK"
)


def ssh_argv() -> list[str]:
    return ["ssh", "-o", "LogLevel=ERROR", "ionos-n8n", SSH_REMOTE]


def main() -> int:
    argv = ssh_argv()
    if any("python3" in a and "-c" in a for a in argv):
        sys.stderr.write("SECRET_INSTALL_FAIL phase=argv-python-c\n")
        return 3
    if "python3 -c" in SSH_REMOTE:
        sys.stderr.write("SECRET_INSTALL_FAIL phase=remote-python-c\n")
        return 3

    try:
        # Unbuffered stdout so the visible terminal shows the prompt immediately.
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
    # Surface only non-secret status tokens.
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
