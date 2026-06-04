const seedData = {
  topics: [
    // Foundation - Linux Fundamentals
    {
      id: "linux-commands",
      title: "Linux Commands",
      category: "Foundation",
      difficulty: "Beginner",
      prerequisites: [],
      summary: "Master essential terminal navigation, file operations, system monitoring, and command piping in Linux environments."
    },
    {
      id: "linux-filesystem",
      title: "Filesystem & Permissions",
      category: "Foundation",
      difficulty: "Beginner",
      prerequisites: ["linux-commands"],
      summary: "Understand the Linux directory hierarchy, file systems, mount points, ownership, and permission systems (chmod, chown)."
    },
    {
      id: "linux-processes",
      title: "Processes & Services (Systemd)",
      category: "Foundation",
      difficulty: "Intermediate",
      prerequisites: ["linux-filesystem"],
      summary: "Learn how to monitor processes, manage services via Systemd, adjust priority, and schedule jobs using Cron."
    },
    // Foundation - Networking
    {
      id: "networking-basics",
      title: "Networking Foundations (OSI, TCP/IP)",
      category: "Foundation",
      difficulty: "Beginner",
      prerequisites: [],
      summary: "Explore network protocols, the OSI & TCP/IP models, DNS resolving, routing, load balancers, and reverse proxies (Nginx)."
    },
    {
      id: "networking-security",
      title: "SSL/TLS & Secure Protocols (SSH)",
      category: "Foundation",
      difficulty: "Intermediate",
      prerequisites: ["networking-basics"],
      summary: "Master secure communication concepts including SSL certificates, HTTPS handshakes, asymmetric key encryption, and SSH keys."
    },
    // Foundation - Shell Scripting
    {
      id: "shell-scripting",
      title: "Bash Shell Scripting",
      category: "Foundation",
      difficulty: "Intermediate",
      prerequisites: ["linux-commands"],
      summary: "Automate repetitive infrastructure tasks using shell scripting variables, loops, conditional checks, and functions."
    },
    // Foundation - Git
    {
      id: "git-workflows",
      title: "Git Version Control & Workflows",
      category: "Foundation",
      difficulty: "Beginner",
      prerequisites: [],
      summary: "Learn basic and advanced Git operations (merge, rebase, cherry-pick) and collaborate using Trunk-based and GitFlow patterns."
    },
    // Containers
    {
      id: "docker-basics",
      title: "Docker Fundamentals",
      category: "Containers",
      difficulty: "Beginner",
      prerequisites: ["linux-filesystem"],
      summary: "Understand container virtualization, pull images, run containers, mount volumes, and write Dockerfiles."
    },
    {
      id: "docker-advanced",
      title: "Advanced Docker & Compose",
      category: "Containers",
      difficulty: "Intermediate",
      prerequisites: ["docker-basics"],
      summary: "Optimize images with multi-stage builds, manage multi-container apps with Docker Compose, and configure private networks."
    },
    // Container Orchestration
    {
      id: "kubernetes-basics",
      title: "Kubernetes Core Concepts",
      category: "Orchestration",
      difficulty: "Intermediate",
      prerequisites: ["docker-advanced"],
      summary: "Explore the Kubernetes control plane, worker nodes, Pods, Deployments, Services, and basic ReplicaSets."
    },
    {
      id: "kubernetes-advanced",
      title: "Advanced Kubernetes (StatefulSets, Ingress, RBAC)",
      category: "Orchestration",
      difficulty: "Advanced",
      prerequisites: ["kubernetes-basics"],
      summary: "Manage stateful apps, define ingress routing rules, secure clusters using RBAC, and package apps with Helm."
    },
    // CI/CD
    {
      id: "cicd-jenkins",
      title: "Jenkins Pipelines",
      category: "CI/CD",
      difficulty: "Intermediate",
      prerequisites: ["git-workflows", "docker-basics"],
      summary: "Set up automation servers, build declarative Jenkins pipelines, integrate tests, and deploy applications."
    },
    {
      id: "cicd-github-actions",
      title: "GitHub Actions CI/CD",
      category: "CI/CD",
      difficulty: "Intermediate",
      prerequisites: ["git-workflows"],
      summary: "Implement automated build-test-deploy workflows using YAML scripts directly inside GitHub repositories."
    },
    // Infrastructure as Code
    {
      id: "iac-terraform",
      title: "Terraform Infrastructure as Code",
      category: "IaC",
      difficulty: "Intermediate",
      prerequisites: ["networking-basics"],
      summary: "Write declarative cloud configuration, manage state files, build modular structures, and configure multi-workspace setups."
    },
    {
      id: "iac-ansible",
      title: "Ansible Configuration Management",
      category: "IaC",
      difficulty: "Intermediate",
      prerequisites: ["linux-commands", "networking-security"],
      summary: "Automate host provisioning, configuration files deployment, and application deployment using YAML Playbooks."
    },
    // Cloud Platforms
    {
      id: "cloud-aws",
      title: "Amazon Web Services (AWS) Core",
      category: "Cloud",
      difficulty: "Beginner",
      prerequisites: ["networking-basics"],
      summary: "Gain proficiency in essential AWS resources including EC2 compute instances, S3 storage, VPC networks, and IAM rules."
    },
    // Monitoring
    {
      id: "monitoring-stack",
      title: "Prometheus & Grafana Observability",
      category: "Monitoring",
      difficulty: "Intermediate",
      prerequisites: ["docker-basics"],
      summary: "Instrument applications, collect metrics, query data with PromQL, and design visually rich dashboards in Grafana."
    },
    // Security
    {
      id: "devsecops-vault",
      title: "HashiCorp Vault Secret Management",
      category: "Security",
      difficulty: "Advanced",
      prerequisites: ["networking-security"],
      summary: "Securely store, generate, and control access to dynamic API keys, database credentials, passwords, and certificates."
    },
    // GitOps
    {
      id: "gitops-argocd",
      title: "GitOps Continuous Delivery with ArgoCD",
      category: "GitOps",
      difficulty: "Advanced",
      prerequisites: ["kubernetes-basics"],
      summary: "Establish git-backed pull-based continuous deployment mechanisms for automated cluster state synchronization."
    },
    // Service Mesh
    {
      id: "service-mesh-istio",
      title: "Istio Service Mesh",
      category: "Service Mesh",
      difficulty: "Advanced",
      prerequisites: ["kubernetes-advanced"],
      summary: "Configure traffic routing, telemetry, mutual TLS, and fault-injection policies inside a microservice mesh."
    },
    // Advanced DevOps
    {
      id: "sre-observability",
      title: "SRE Foundations & High Availability",
      category: "Advanced",
      difficulty: "Advanced",
      prerequisites: ["monitoring-stack"],
      summary: "Learn Site Reliability Engineering principles, SLO/SLI models, failover, disaster recovery, and global scaling."
    }
  ],

  topicContents: [
    {
      topicId: "linux-commands",
      overview: "Introduction to the Linux shell, navigation, and core operations.",
      theory: "The command-line interface (CLI) is the most powerful interface to interact with the Linux kernel. A shell (like Bash or Zsh) takes commands from the user, interprets them, and passes them to the operating system's kernel. Standard operations involve working with streams: STDIN (0), STDOUT (1), and STDERR (2), which can be redirected using standard operators like `>`, `>>`, `<`, and `|` (pipes) to link programs together.",
      visualExplanation: "```\n[User Shell Input] ──> [interpreter (Bash)] ──> [Kernel System Calls]\n        ▲                                                 │\n        └───────── [Stdout/Stderr Redirected] ◄───────────┘\n```",
      realWorldExample: "A DevOps engineer needs to extract IP addresses from a web log file and find the top 5 unique visitors. Using a pipeline:\n`cat access.log | awk '{print $1}' | sort | uniq -c | sort -nr | head -n 5`",
      commands: [
        { command: "ls -la", description: "List all files including hidden ones with details" },
        { command: "cd /var/log", description: "Change working directory to system logs folder" },
        { command: "grep -r 'error' .", description: "Search recursively for the string 'error' in current folder" },
        { command: "df -h", description: "Show disk space utilization in human-readable format" },
        { command: "top / htop", description: "Monitor real-time system resources and active processes" }
      ],
      bestPractices: [
        "Avoid running commands directly as root; use sudo to enforce accountability.",
        "Use relative paths where possible for flexibility, but absolute paths in automation scripts to prevent location ambiguity.",
        "Always test piped commands with small sample files before executing on massive production logs."
      ],
      commonMistakes: [
        "Using `rm -rf *` without checking the current working directory (`pwd`).",
        "Forgetting to escape characters or using simple quotes when expansion of variables is needed."
      ],
      labs: [
        {
          title: "Log Analysis Challenge",
          steps: [
            "Navigate to the directory `/var/log` using the `cd` command.",
            "List the files and find the file named `syslog` or `messages`.",
            "Count the number of lines containing the term 'cron' using `grep -c`.",
            "Direct the output of these cron entries to a new file named `cron_events.txt` in your user home directory."
          ]
        }
      ],
      miniProject: {
        title: "Backup and Clean-up Script",
        description: "Write a small automated bash task that compresses log folders older than 7 days, back them up to a backup partition, and purge the old directories.",
        steps: [
          "Create a temporary directory for backups.",
          "Identify logs updated more than 7 days ago using `find`.",
          "Zip and move them using `tar`.",
          "Ensure success before purging original files."
        ],
        solution: "```bash\n#!/bin/bash\nBACKUP_DIR='/tmp/backup'\nmkdir -p $BACKUP_DIR\nfind /var/log -name '*.log' -mtime +7 -exec tar -czf $BACKUP_DIR/logs_$(date +%F).tar.gz {} +\nif [ $? -eq 0 ]; then\n  find /var/log -name '*.log' -mtime +7 -delete\n  echo 'Logs successfully backed up and deleted.'\nfi\n```"
      }
    },
    {
      topicId: "linux-filesystem",
      overview: "Understanding the hierarchical folder layout, file attributes, ownership, and read/write permission bits.",
      theory: "Linux follows a single-root tree structure where everything (including hardware nodes) is represented as a file. Standard permissions consist of Read (r=4), Write (w=2), and Execute (x=1) for three categories: Owner (user), Group, and Others. Commands like `chmod` edit permissions, while `chown` alters user/group ownership. The filesystem structure relies on inodes (index nodes) which hold file metadata without relying on file names.",
      visualExplanation: "```\nPermissions:  d  rwx  r-x  r-- \n             │   │    │    └── Others (read-only)\n             │   │    └─────── Group (read + execute)\n             │   └──────────── Owner (read, write + execute)\n             └──────────────── File Type (d=directory, -=file)\n```",
      realWorldExample: "A web application server running as the `nginx` user cannot read config files under `/opt/myapp` because the folder is owned by `root:root` with permissions `700`. You modify the ownership to `root:nginx` and permissions to `750` so the web server can securely read config files.",
      commands: [
        { command: "chmod 755 script.sh", description: "Make script executable for everyone, writable only by owner" },
        { command: "chown -R devops:webgroup /var/www", description: "Change directory owner and group recursively" },
        { command: "ls -i", description: "Display files with their corresponding inode numbers" },
        { command: "ln -s source.txt symlink.txt", description: "Create a symbolic soft link pointing to target file" },
        { command: "stat filename", description: "Display detailed file status information (timestamps, inodes, size)" }
      ],
      bestPractices: [
        "Adhere to the principle of least privilege: assign 600 or 640 permissions to configuration files containing credentials.",
        "Always use the recursive flag (`-R`) with extreme caution when changing ownership/permissions.",
        "Prefer soft links (`ln -s`) over hard links when pointing across different mounted filesystems."
      ],
      commonMistakes: [
        "Applying `chmod 777` to files just to resolve simple permission blockages.",
        "Editing system mounts directly in `/etc/fstab` without validating configuration via `mount -a` first."
      ],
      labs: [
        {
          title: "Securing App Credentials",
          steps: [
            "Create a new file named `db_creds.conf` with database configuration details.",
            "Observe default permissions using `ls -l`.",
            "Remove all read/write/execute permissions for group and others using `chmod`.",
            "Verify the file is only readable by the owner (`-rw-------`)."
          ]
        }
      ],
      miniProject: {
        title: "Shared Team Folder Setup",
        description: "Set up a directory where members of the group 'devs' can write files, ensuring new files inherit the group automatically.",
        steps: [
          "Create a group called 'devs'.",
          "Create folder '/opt/shared_devs' and assign it to the 'devs' group.",
          "Apply the SGID bit to enforce automatic group inheritance."
        ],
        solution: "```bash\nsudo groupadd devs\nsudo mkdir -p /opt/shared_devs\nsudo chown -R :devs /opt/shared_devs\nsudo chmod -R 2775 /opt/shared_devs # 2 enables SGID\n```"
      }
    },
    {
      topicId: "docker-basics",
      overview: "Deep dive into Docker engine architecture, container lifecycles, and core command execution.",
      theory: "Docker isolates processes using Linux namespaces (for workspace isolation like network, pid, mount) and control groups (cgroups, for resource limits like memory, CPU). Instead of spinning up a full virtual machine with a guest operating system, containers share the host kernel, yielding lightweight, fast-starting packaging units. Dockerfiles use cached layers where each command adds a layer to the read-only image. Spin-up creates a thin writeable container layer.",
      visualExplanation: "```\n┌───────────────────────────────────────────────┐\n│            Thin Writeable Container Layer     │\n├───────────────────────────────────────────────┤\n│            Image Layer N (e.g., RUN npm install)│\n├───────────────────────────────────────────────┤\n│            Image Layer 0 (e.g., FROM node:20) │\n└───────────────────────────────────────────────┘\n```",
      realWorldExample: "Deploying a Node.js web backend container in under 5 seconds with guaranteed dependencies. A single Docker command ports it across local machines, test stages, and Kubernetes production clusters without environmental errors.",
      commands: [
        { command: "docker build -t myapp:1.0 .", description: "Build image from Dockerfile in current directory" },
        { command: "docker run -d -p 8080:3000 --name web myapp:1.0", description: "Run container in background, port map 8080 to 3000" },
        { command: "docker ps -a", description: "List all active and inactive containers" },
        { command: "docker volume create data_vol", description: "Create named persistent storage volume" },
        { command: "docker exec -it web /bin/bash", description: "Open interactive terminal inside running container" }
      ],
      bestPractices: [
        "Include a `.dockerignore` file to exclude `node_modules`, log files, and local build files from build context.",
        "Always specify exact tag versions (e.g., `node:20.11-alpine`) instead of using dynamic tags like `latest`.",
        "Run containers as non-root users using the `USER` instruction in the Dockerfile."
      ],
      commonMistakes: [
        "Storing configuration state or logs inside the writeable layer instead of utilizing external volumes or log drivers.",
        "Structuring the Dockerfile poorly (e.g., running `COPY . .` before `RUN npm install`), which breaks build caching."
      ],
      labs: [
        {
          title: "Build and Run your First Container",
          steps: [
            "Write a simple Node.js file that starts an HTTP server on port 3000.",
            "Write a Dockerfile using `node:alpine` base image.",
            "Build the image and assign tag `node-server:v1`.",
            "Launch it in detached mode on host port `8080`.",
            "Verify it returns output using `curl http://localhost:8080`."
          ]
        }
      ],
      miniProject: {
        title: "Multi-Service Local Environment",
        description: "Set up a docker-compose file that links an Express API service with a PostgreSQL database, injecting environment secrets and mapping volumes.",
        steps: [
          "Define 'api' and 'db' services in a `docker-compose.yml` file.",
          "Inject passwords via Environment variables.",
          "Configure network for internal communication.",
          "Attach a volume to `/var/lib/postgresql/data` for database persistence."
        ],
        solution: "```yaml\nversion: '3.8'\nservices:\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_USER: devops\n      POSTGRES_PASSWORD: secretpassword\n      POSTGRES_DB: appdb\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n    networks:\n      - appnet\n  api:\n    build: ./api\n    ports:\n      - '5000:5000'\n    environment:\n      DB_HOST: db\n      DB_PORT: 5432\n    depends_on:\n      - db\n    networks:\n      - appnet\nvolumes:\n  pgdata:\nnetworks:\n  appnet:\n```"
      }
    },
    {
      topicId: "networking-basics",
      overview: "Deep dive into core networking protocols, layer structures, DNS name resolutions, secure TLS exchanges, and web proxy architectures.",
      theory: "Computer networks operate using stack-based communication architectures. The OSI Model maps this into 7 logical layers: Physical, Data Link, Network (IP routing), Transport (TCP/UDP sessions), Session, Presentation (SSL/TLS encryption), and Application (HTTP/DNS). The TCP/IP model simplifies this into 4 layers.\n\nKey network systems include:\n1. DNS: Resolves domain hostnames to IP addresses using root servers, TLD name servers, and authoritative records (A, AAAA, CNAME, TXT).\n2. Transport Protocols: TCP ensures stateful, ordered, error-checked packet delivery via a 3-way handshake (SYN, SYN-ACK, ACK), while UDP provides lightweight connectionless speed.\n3. SSL/TLS: Establishes HTTPS secure channels using asymmetric cryptography for handshake authentication and symmetric cryptography for session data stream encryption.\n4. Infrastructure Routing & Proxies: Load Balancers distribute traffic across multiple target hosts at Layer 4 (Transport) or Layer 7 (Application). Reverse Proxies (like Nginx) act as client gateways, managing SSL termination, rate-limiting, and backend service routing.",
      visualExplanation: "```\n[Client Web Browser] ──(HTTPS/443 Request)──> [Nginx Reverse Proxy & Load Balancer]\n                                                       │\n                                    ┌──────────────────┴──────────────────┐\n                                    ▼ (HTTP/8080)                         ▼ (HTTP/8080)\n                           [Service Pod A (UI)]                  [Service Pod B (API)]\n```",
      realWorldExample: "A cloud deployment routes incoming public domain traffic through an AWS VPC Internet Gateway. An Application Load Balancer terminates SSL/TLS certificates and forwards requests to private EC2 target hosts running microservices on standard internal port bindings.",
      commands: [
        { command: "ping -c 4 1.1.1.1", description: "Send ICMP echo request packets to verify host reachability" },
        { command: "nslookup devops-compass.local", description: "Perform simple hostname resolution query using DNS nameservers" },
        { command: "dig +short A github.com", description: "Perform advanced DNS lookup returning target IP address mappings" },
        { command: "traceroute google.com", description: "Trace packet route hops to target destination" },
        { command: "ss -tuln", description: "Display active listening TCP/UDP port socket connections on the host" }
      ],
      bestPractices: [
        "Deploy database instances exclusively in isolated private subnets, restricting traffic access via firewall Security Groups.",
        "Enable SSL/TLS termination at the load balancer or proxy layer to reduce CPU load on individual app instances.",
        "Implement rate-limiting and DDoS mitigation rules at the application gateway layer."
      ],
      commonMistakes: [
        "Exposing internal system ports (like SSH port 22 or Redis port 6379) directly to the public internet.",
        "Failing to restrict DNS zone transfers, leaking network topology details to unauthorized users."
      ],
      labs: [
        {
          title: "DNS and Port Analysis Challenge",
          steps: [
            "Use `nslookup` or `dig` to find the IP address of `example.com`.",
            "Inspect listening ports on your machine using `ss -tuln`.",
            "Verify network route hops to `8.8.8.8` using `traceroute`.",
            "Verify firewall blocking actions by attempting a port connection using telnet or nc."
          ]
        }
      ],
      miniProject: {
        title: "Nginx Reverse Proxy Setup",
        description: "Configure Nginx as a reverse proxy that terminates incoming HTTP requests on port 80 and forwards them internally to a Node.js server running on port 5000.",
        steps: [
          "Install Nginx configuration server packages.",
          "Write a custom config block inside `/etc/nginx/conf.d/proxy.conf`.",
          "Define the proxy pass target to `http://127.0.0.1:5000`.",
          "Validate configuration using `nginx -t` and reload the service."
        ],
        solution: "```nginx\nserver {\n    listen 80;\n    server_name myapp.local;\n\n    location / {\n        proxy_pass http://127.0.0.1:5000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    }\n}\n```"
      }
    },
    {
      topicId: "git-workflows",
      overview: "Deep dive into Git version control, local staging zones, branching strategies, rebase operations, and collaborative trunk-based workflows.",
      theory: "Git is a distributed version control system that tracks file changes across local directories. Git operates in four logical zones: Workspace (untracked/modified files), Staging Area (index of files staged for commit), Local Repository (committed history), and Remote Repository (shared origin repository).\n\nKey collaborate workflows include:\n1. GitFlow: Uses dedicated branches for `main` (production), `develop` (integration), `feature/*` (development), `release/*` (staging), and `hotfix/*` (production patch). Suitable for scheduled releases.\n2. Trunk-Based Development: Developers commit small batch changes directly to a single branch (`main`/`trunk`) frequently, running automated CI tests on each commit. Minimizes merge conflicts and increases velocity.\n3. Merge vs. Rebase: `git merge` creates a merge commit preserving historical context, while `git rebase` rewrites history by moving local commits on top of the target branch, keeping commits linear.",
      visualExplanation: "```\nTrunk-Based:\n[main] ───●─────●─────●─────●─── (Continuous commits)\n           \\   /       \\   /\n  [feat]    ●───●       ●─●  (Short-lived branch)\n\nGitFlow:\n[main] ─────────────────●────── (Production releases)\n                       / \\\n[dev]  ──●───●───●────●───●──── (Feature integration)\n          \\ /     \\  /\n[feat]    ●─●      ●─●          (Long-running feature)\n```",
      realWorldExample: "A engineering team of 15 developers uses Trunk-Based development. Each developer creates short-lived branches (lasting under 24 hours), resolves local rebase conflicts, runs local checks, and creates Pull Requests merging into `main` after green CI tests.",
      commands: [
        { command: "git init", description: "Initialize a new local Git repository in current folder" },
        { command: "git clone <url>", description: "Download remote repository history and checkout files" },
        { command: "git add .", description: "Stage all current modifications for commit" },
        { command: "git commit -m 'feat: add auth'", description: "Record staged snapshot to local repository history" },
        { command: "git push origin main", description: "Upload local repository commits to remote shared main branch" },
        { command: "git rebase origin/main", description: "Rewrite local history by applying commits on top of main branch" },
        { command: "git cherry-pick <hash>", description: "Apply changes introduced by a specific existing commit hash" },
        { command: "git stash", description: "Temporarily shelve modified tracked files to clear workspace" }
      ],
      bestPractices: [
        "Include a `.gitignore` file to ensure API keys, database credentials, build folders, and IDE configs are never committed.",
        "Keep commits atomic and write descriptive commit logs conforming to Conventional Commits standards.",
        "Never rewrite or force-push commits on shared public branches like develop or main."
      ],
      commonMistakes: [
        "Committing secrets and password files, requiring git filter-repo or BFG Repo-Cleaner to scrub history.",
        "Resolving merge conflicts by overwriting files blindly without consulting team members."
      ],
      labs: [
        {
          title: "Linear History Rebase Challenge",
          steps: [
            "Create a new local branch named `feature-auth` from `main`.",
            "Make a change and commit it locally.",
            "Switch back to `main`, modify a different file, and commit.",
            "Switch to `feature-auth` and run `git rebase main` to re-apply your changes linearly.",
            "Resolve any merge conflicts if they occur, and finalize using `git rebase --continue`."
          ]
        }
      ],
      miniProject: {
        title: "Branch Protection & Workflow Automation",
        description: "Set up a Git repository workflow simulating branch protection. Prevent direct pushes to main and require pull requests with test pass conditions.",
        steps: [
          "Initialize a Git repository and commit an initial structure.",
          "Establish main and develop branches.",
          "Write a git hook (pre-commit or pre-push) that runs lint checks before allowing commits.",
          "Perform a pull request simulation using branch merges."
        ],
        solution: "```bash\n# Pre-commit hook template inside .git/hooks/pre-commit\n#!/bin/sh\nnpm run lint\nif [ $? -ne 0 ]; then\n  echo 'Linting checks failed. Commit aborted.'\n  exit 1\nfi\n```"
      }
    }
  ],

  quizzes: [
    {
      topicId: "linux-commands",
      questions: [
        {
          questionText: "Which standard descriptor number represents STDERR (Standard Error) in Linux?",
          options: ["0", "1", "2", "3"],
          correctIndex: 2,
          explanation: "In Linux streams, 0 represents STDIN, 1 represents STDOUT, and 2 represents STDERR."
        },
        {
          questionText: "What command displays real-time resource usage, CPU allocation, and active processes?",
          options: ["ps -ef", "df -h", "top", "free -m"],
          correctIndex: 2,
          explanation: "`top` (and its modern wrapper `htop`) displays real-time, dynamic information about active CPU processes, memory, and load."
        },
        {
          questionText: "How do you append the output of a command to a file instead of overwriting it?",
          options: [">", ">>", "|", "&&"],
          correctIndex: 1,
          explanation: "The `>>` operator appends to the file, while `>` overwrites the content."
        }
      ]
    },
    {
      topicId: "linux-filesystem",
      questions: [
        {
          questionText: "What permission set corresponds to chmod octal number 750?",
          options: [
            "rwxr-xr-x",
            "rwxr-x---",
            "rw-r-----",
            "rwx------"
          ],
          correctIndex: 1,
          explanation: "7 is rwx (read, write, execute), 5 is r-x (read, execute), and 0 is --- (no permissions)."
        },
        {
          questionText: "Which of the following points across filesystems and breaks if the source file is deleted?",
          options: ["Hard link", "Symbolic link (Soft link)", "Inode index", "Mount partition"],
          correctIndex: 1,
          explanation: "A symbolic link contains the path to the original file. If the source file is deleted, the symlink breaks."
        }
      ]
    },
    {
      topicId: "docker-basics",
      questions: [
        {
          questionText: "Which Linux kernel feature regulates resource limit controls (like max RAM) for Docker containers?",
          options: ["Namespaces", "Control Groups (cgroups)", "SELinux", "systemd"],
          correctIndex: 1,
          explanation: "cgroups (control groups) limit resource metrics like memory, CPU, and network bandwidth for processes."
        },
        {
          questionText: "How does Docker secure image sizes during builds, dropping build toolchains and leaving only execution dependencies?",
          options: ["Docker Compose", "Multi-stage builds", "Caching layers", "Overlay2 drivers"],
          correctIndex: 1,
          explanation: "Multi-stage builds allow developers to use temporary heavy images with compilers, copy build artifacts, and output tiny runner images."
        }
      ]
    },
    {
      topicId: "networking-basics",
      questions: [
        {
          questionText: "Which layer of the OSI model does a Router operate on?",
          options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
          correctIndex: 1,
          explanation: "Routers route traffic across different networks using IP addresses, which reside at the Network Layer (Layer 3)."
        },
        {
          questionText: "Which TCP handshake flag sequence represents the initial connection establishment?",
          options: ["SYN -> SYN-ACK -> ACK", "SYN -> ACK -> SYN-ACK", "ACK -> SYN -> SYN-ACK", "SYN-ACK -> SYN -> ACK"],
          correctIndex: 0,
          explanation: "The standard TCP 3-way handshake begins with a SYN from the client, followed by SYN-ACK from the server, and ends with an ACK from the client."
        },
        {
          questionText: "What is the primary role of a reverse proxy like Nginx?",
          options: ["Translating private IP addresses to public IPs in a router", "Caching database queries", "Acting as a gateway to receive client requests and forward them to backend services", "Encrypting files on the local filesystem"],
          correctIndex: 2,
          explanation: "A reverse proxy acts as an intermediary, receiving public incoming client requests and routing them to internal backend services."
        }
      ]
    },
    {
      topicId: "git-workflows",
      questions: [
        {
          questionText: "Which command allows you to apply changes from a specific commit hash onto your current branch?",
          options: ["git merge", "git cherry-pick", "git rebase", "git checkout"],
          correctIndex: 1,
          explanation: "git cherry-pick <commit-hash> applies the changes introduced by a specific existing commit."
        },
        {
          questionText: "In Trunk-Based Development, how do developers typically manage branch lifespans?",
          options: ["Keep feature branches open for several weeks or months", "Work on long-lived release branches", "Commit small, frequent changes to short-lived branches merged quickly into the main trunk", "Avoid using branches entirely by committing directly to production servers"],
          correctIndex: 2,
          explanation: "Trunk-Based Development relies on developers committing to short-lived branches (usually less than a day) and merging them back to the main trunk frequently."
        },
        {
          questionText: "What is the primary difference between git merge and git rebase?",
          options: [
            "Git rebase preserves historical commit order exactly, whereas merge deletes it.",
            "Git merge creates a new merge commit, preserving historical context, while rebase rewrites commits linearly on top of the target branch.",
            "Git rebase is only used for remote repositories, and merge is only used locally.",
            "Git merge changes the files permanently, whereas rebase only acts as a preview."
          ],
          correctIndex: 1,
          explanation: "Merge keeps the actual timeline branching structure intact with a merge commit, whereas rebase places the branch commits on top of the target branch, rewriting history linearly."
        }
      ]
    }
  ],

  tools: [
    {
      toolName: "Docker",
      name: "Docker",
      category: "Containers",
      features: ["Containerization", "Layered filesystem", "Isolated networks", "Docker Hub"],
      overview: "Standard lightweight software containerization engine.",
      installation: {
        linux: "sudo apt-get update && sudo apt-get install docker.io -y\nsudo systemctl enable --now docker",
        mac: "Download and install Docker Desktop dmg package from official site.",
        windows: "Download and install Docker Desktop exe package. Requires WSL2 engine."
      },
      architecture: "Client-Server model. The Docker client communicates via REST APIs with the Docker Daemon (`dockerd`), which handles building, running, and managing container storage pools.",
      commands: [
        { command: "docker run <image>", description: "Run container instance" },
        { command: "docker ps", description: "List running containers" },
        { command: "docker inspect <id>", description: "Fetch detailed metadata of object" },
        { command: "docker system prune", description: "Clean up unused images, containers, networks" }
      ],
      examples: [
        {
          title: "Simple Web Server Container",
          code: "docker run -d -p 80:80 --name webserver nginx:alpine",
          description: "Launches Nginx web server bound to local port 80."
        }
      ],
      useCases: ["Microservice isolation", "Consistency across environments", "CI pipeline build agents"],
      alternatives: ["Podman", "containerd", "CRI-O"],
      interviewQuestions: [
        {
          question: "What is the difference between a Docker image and a container?",
          answer: "An image is a read-only template containing dependencies, code, and config. A container is a runnable writeable instance of that image."
        }
      ]
    },
    {
      toolName: "Kubernetes",
      name: "Kubernetes",
      category: "Orchestration",
      features: ["Self-healing", "Auto-scaling", "Service discovery", "Secret/Config management"],
      overview: "Enterprise-grade container orchestration system to automate deployment, scaling, and management of containerized apps.",
      installation: {
        linux: "curl -LO 'https://dl.k8s.io/release/v1.29.0/bin/linux/amd64/kubectl'\nsudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl",
        mac: "brew install kubectl",
        windows: "winget install Kubernetes.kubectl"
      },
      architecture: "Control Plane components (API Server, Etcd, Scheduler, Controller Manager) orchestrate Workers containing Kubelet agent, Kube-proxy, and Container runtime.",
      commands: [
        { command: "kubectl get pods", description: "List all active pods" },
        { command: "kubectl apply -f manifest.yaml", description: "Apply configuration manifest file to cluster" },
        { command: "kubectl logs <pod-name>", description: "Show logs of a pod" },
        { command: "kubectl exec -it <pod-name> -- sh", description: "Interactive shell access into container" }
      ],
      examples: [
        {
          title: "Simple Deployment yaml",
          code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-deploy\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: myapp\n  template:\n    metadata:\n      labels:\n        app: myapp\n    spec:\n      containers:\n      - name: main\n        image: nginx:alpine",
          description: "Launches 3 replicas of Nginx pods."
        }
      ],
      useCases: ["Self-healing systems", "Horizontal scaling", "Rolling release deployments"],
      alternatives: ["Docker Swarm", "HashiCorp Nomad", "AWS ECS"],
      interviewQuestions: [
        {
          question: "What is a Pod in Kubernetes?",
          answer: "A Pod is the smallest deployable object in Kubernetes. It represents a single instance of a running process and can contain one or more co-located containers."
        }
      ]
    },
    {
      toolName: "Terraform",
      name: "Terraform",
      category: "IaC",
      features: ["Declarative configuration", "State tracking", "Multi-cloud providers", "Dependency graphs"],
      overview: "Infrastructure as Code tool to build, change, and version cloud infrastructure safely and efficiently.",
      installation: {
        linux: "wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg\necho \"deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main\" | sudo tee /etc/apt/sources.list.d/hashicorp.list\nsudo apt update && sudo apt install terraform",
        mac: "brew install hashicorp/tap/terraform",
        windows: "choco install terraform"
      },
      architecture: "Declarative execution. Utilizes provider plugins (AWS, GCP, etc.) to evaluate state files (`.tfstate`) against cloud status and execute configuration.",
      commands: [
        { command: "terraform init", description: "Initialize backend state and download providers" },
        { command: "terraform plan", description: "Verify syntax and show planned actions" },
        { command: "terraform apply", description: "Deploy configuration to active targets" },
        { command: "terraform destroy", description: "Purge managed infrastructure resources" }
      ],
      examples: [
        {
          title: "Create AWS S3 Bucket",
          code: "resource \"aws_s3_bucket\" \"assets\" {\n  bucket = \"devops-compass-bucket-999\"\n}",
          description: "Defines a unique S3 bucket resource."
        }
      ],
      useCases: ["Multi-cloud infrastructure provision", "Reproducible testing envs", "Resource drift detection"],
      alternatives: ["Pulumi", "AWS CloudFormation", "OpenTofu"],
      interviewQuestions: [
        {
          question: "Why is the Terraform state file (.tfstate) important?",
          answer: "It maps configurations to real-world cloud resources, tracks metadata, and manages dependency order for resource updates."
        }
      ]
    }
  ],

  projects: [
    {
      title: "Dockerized Node App",
      category: "Beginner",
      goal: "Learn container virtualization by packaging a full-stack Javascript website into Docker images.",
      architectureDescription: "Node.js frontend/backend combined in light alpine layers with customized user permissions and config mounts.",
      steps: [
        "Create an Express API project on your local machine.",
        "Add a Dockerfile that implements cached layers.",
        "Configure Dockerignore to skip node_modules.",
        "Build, tag, and verify running behavior on local port 8080."
      ],
      expectedOutcome: "A functional lightweight image running as a container, delivering a JSON welcome screen."
    },
    {
      title: "CI/CD Pipeline with GitHub Actions",
      category: "Intermediate",
      goal: "Establish automatic build, test, and container packaging pipelines triggered on git commit pushes.",
      architectureDescription: "Developer pushes code -> GitHub runner checks out code -> Linting checks -> Docker Build -> Docker Hub push -> Webhook notification.",
      steps: [
        "Create a repository on GitHub.",
        "Build a `.github/workflows/deploy.yml` file.",
        "Configure repository Action Secrets for Docker credentials.",
        "Verify build logs trigger on your commits."
      ],
      expectedOutcome: "Green builds on commits, with auto-incremented image tags appearing in your public Docker Hub."
    },
    {
      title: "Kubernetes Microservices",
      category: "Advanced",
      goal: "Deploy a three-tier architecture (UI, API, and DB) with load balancing and service discovery on a local cluster.",
      architectureDescription: "Ingress Controller routes traffic to NodePort Service -> UI App Pods -> ClusterIP Service -> REST API Pods -> ConfigMap secrets -> MongoDB database.",
      steps: [
        "Configure Minikube or Kind local cluster.",
        "Write deployments and services manifests.",
        "Implement Liveness and Readiness probes for service self-healing.",
        "Deploy the manifests and access via Ingress routing."
      ],
      expectedOutcome: "A fully resilient multi-pod application cluster accessible via custom local hostname."
    },
    {
      title: "GitOps Infrastructure",
      category: "Production",
      goal: "Implement git-centered cluster synchronization using ArgoCD.",
      architectureDescription: "Git Repository acts as single source of truth. ArgoCD controller pulls changes and syncs manifests to Kubernetes cluster.",
      steps: [
        "Install ArgoCD in local/remote Kubernetes cluster.",
        "Establish connection from ArgoCD controller to your infrastructure repository.",
        "Define an Application resource pointing to the target folder.",
        "Modify replica numbers in git and witness instant cluster autoscaling without terminal commands."
      ],
      expectedOutcome: "Automated real-time deployment synchronization of git configuration directly onto operational clusters."
    }
  ],

  interviewQuestions: [
    {
      category: "Linux",
      question: "What is an inode and what type of information does it store?",
      answer: "An inode is a data structure on a Linux filesystem that contains information about a file, including its size, owner, permissions, file type, and pointers to the disk blocks storing its content. It does not store the file name or the actual data contents.",
      difficulty: "Intermediate",
      scenarioBased: false
    },
    {
      category: "Docker",
      question: "How can you minimize Docker image sizes in production setups?",
      answer: "Use multi-stage builds to exclude build tool chains, choose minimal base images like Alpine Linux, combine RUN commands to reduce layers, minimize package installs, and use .dockerignore files to prevent copying build bloat.",
      difficulty: "Intermediate",
      scenarioBased: false
    },
    {
      category: "Kubernetes",
      question: "Explain the difference between Liveness, Readiness, and Startup probes.",
      answer: "Startup probes run first to check if a container has initialized. Once it passes, Liveness probes run to check if the app is alive (restarts container on failure). Readiness probes run to verify if the container is ready to accept user request traffic (temporarily drops it from service routing on failure).",
      difficulty: "Advanced",
      scenarioBased: true
    },
    {
      category: "Terraform",
      question: "What is 'State Drift' and how do you handle it in production environments?",
      answer: "State drift occurs when resources are modified directly in the cloud console, causing the local terraform state file to fall out of sync. It is detected using 'terraform plan' (which compares code vs current state) and resolved by applying configuration changes or importing modifications via 'terraform import'.",
      difficulty: "Advanced",
      scenarioBased: true
    }
  ],

  certifications: [
    {
      provider: "AWS",
      name: "AWS Certified Cloud Practitioner",
      code: "CLF-C02",
      level: "Foundational",
      domains: [
        { name: "Cloud Technology Concepts", weight: "24%" },
        { name: "Security and Compliance", weight: "30%" },
        { name: "Cloud Core Services", weight: "34%" },
        { name: "Billing, Pricing, and Support", weight: "12%" }
      ],
      resources: ["Official AWS CLF Guide", "AWS Whitepapers", "AWS Academy Modules"]
    },
    {
      provider: "Kubernetes",
      name: "Certified Kubernetes Administrator",
      code: "CKA",
      level: "Associate",
      domains: [
        { name: "Cluster Architecture, Installation & Config", weight: "25%" },
        { name: "Workloads & Scheduling", weight: "15%" },
        { name: "Services & Networking", weight: "20%" },
        { name: "Storage", weight: "10%" },
        { name: "Troubleshooting", weight: "30%" }
      ],
      resources: ["Kubernetes Documentation", "Killercoda Scenarios", "CKA Udemy Courses"]
    },
    {
      provider: "Terraform",
      name: "HashiCorp Certified: Terraform Associate",
      code: "TA-003",
      level: "Associate",
      domains: [
        { name: "Understand Infrastructure as Code (IaC)", weight: "7%" },
        { name: "Understand Terraform's purpose", weight: "7%" },
        { name: "Use Terraform CLI", weight: "15%" },
        { name: "Interact with Terraform modules", weight: "10%" },
        { name: "Manage state", weight: "15%" },
        { name: "Read, generate, and modify configuration", weight: "26%" }
      ],
      resources: ["HashiCorp Developer Tutorials", "Official Terraform Associate Exam Prep"]
    }
  ],
  resources: [
    {
      title: "awesome-devops",
      type: "repo",
      category: "General",
      url: "https://github.com/Jitsusama/awesome-devops",
      description: "A curated list of awesome DevOps platforms, tools, frameworks, and resources.",
      owner: "Jitsusama",
      stars: "14.2k",
      forks: "2.5k"
    },
    {
      title: "kubernetes",
      type: "repo",
      category: "Containers",
      url: "https://github.com/kubernetes/kubernetes",
      description: "Production-Grade Container Scheduling and Management System.",
      owner: "kubernetes",
      stars: "105.4k",
      forks: "38.2k"
    },
    {
      title: "terraform-provider-aws",
      type: "repo",
      category: "IaC",
      url: "https://github.com/hashicorp/terraform-provider-aws",
      description: "The Terraform AWS provider allows Terraform to configure AWS infrastructure.",
      owner: "hashicorp",
      stars: "9.8k",
      forks: "4.1k"
    },
    {
      title: "How We Scaled Our Kubernetes Cluster to 5,000 Nodes",
      type: "article",
      category: "Containers",
      url: "https://dev.to/t/devops",
      description: "An in-depth writeup on scaling large-scale Kubernetes clusters to run workloads with minimal overhead.",
      author: "David Vance",
      source: "Dev.to",
      likes: 342,
      comments: 48,
      readTime: "6 min read"
    },
    {
      title: "Mastering Terraform State: Common Anti-patterns and Solutions",
      type: "article",
      category: "IaC",
      url: "https://medium.com/tag/devops",
      description: "A deep dive into remote state locking, state migration strategies, and state recovery commands.",
      author: "Helen Park",
      source: "Medium / DevOps",
      likes: 219,
      comments: 15,
      readTime: "8 min read"
    }
  ],
  notes: [
    {
      id: "note-1",
      title: "Docker Networking Cheat Sheet",
      content: "# Docker Networking\n\n- Bridge: Default driver for container communication on same host\n- Host: Bypasses container network isolation, shares host's network namespace\n- Overlay: Multi-host networking for Swarm clusters\n- None: Disables all networking for container",
      category: "Containers",
      tags: ["docker", "networking"]
    },
    {
      id: "note-2",
      title: "Kubernetes Commands Cheat Sheet",
      content: "# K8s Cheat Sheet\n\n```bash\nkubectl get pods -n kube-system\nkubectl describe pod <pod-name>\nkubectl logs -f <pod-name>\n```",
      category: "Orchestration",
      tags: ["k8s", "cheat-sheet"]
    }
  ]
};

module.exports = seedData;
