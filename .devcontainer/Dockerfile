# The workshop image (ghcr.io/bluesky-social/workshop) rebuilt on the Swift
# image, so the exercises can be done in Swift. Node.js stays for the exercises
# that are still in TypeScript.
FROM swift:6.4-noble

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update; \
    apt-get install -y --no-install-recommends curl git make sudo vim software-properties-common build-essential less locales openssh-client; \
    /bin/bash -c "$(curl -fsSL https://deb.nodesource.com/setup_20.x)"; \
    apt-get install -y --no-install-recommends nodejs; \
    rm -rf /var/lib/apt/lists/*; \
    echo "PATH=/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/go/bin:$PATH" >> /etc/bash.bashrc; \
    echo "" >> /etc/bash.bashrc; \
    echo "if [ -f /workspace/.bash.cfg ]; then" >> /etc/bash.bashrc; \
    echo "    . /workspace/.bash.cfg" >> /etc/bash.bashrc; \
    echo "fi" >> /etc/bash.bashrc; \
    echo "" >> /etc/bash.bashrc; \
    locale-gen en_US.UTF-8; \
    npm i -g @atproto/lex tsx; \
    useradd -ms /bin/bash -G sudo linuxbrew; \
    echo "linuxbrew ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER linuxbrew

RUN chmod -R 755 /home/linuxbrew; \
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
    /home/linuxbrew/.linuxbrew/bin/brew install jq goat go pnpm --ignore-dependencies; \
    # websocat links against Homebrew's OpenSSL, so install it with its dependencies.
    /home/linuxbrew/.linuxbrew/bin/brew install websocat; \
    CGO_ENABLED=1 /home/linuxbrew/.linuxbrew/bin/go install github.com/bluesky-social/indigo/cmd/tap@latest; \
    /home/linuxbrew/.linuxbrew/bin/brew reinstall -s oniguruma; \
    /home/linuxbrew/.linuxbrew/bin/brew cleanup --prune=all
