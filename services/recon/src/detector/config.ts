export type PathCategory =
  | "env"
  | "git"
  | "keys"
  | "config"
  | "backup"
  | "info"
  | "api"
  | "public";

export interface SensitivePathDef {
  path: string;
  category: PathCategory;
  isSensitive: boolean;
  expectedContentTypes?: string[];
  description: string;
}

export const SENSITIVE_PATHS: SensitivePathDef[] = [
  // Environment Files
  { path: "/.env", category: "env", isSensitive: true, description: "Environment variables with potential secrets" },
  { path: "/.env.local", category: "env", isSensitive: true, description: "Local environment variables" },
  { path: "/.env.production", category: "env", isSensitive: true, description: "Production environment configuration" },
  { path: "/.env.backup", category: "env", isSensitive: true, description: "Backup of environment file" },
  { path: "/.env.example", category: "env", isSensitive: false, description: "Example environment template" },

  // Git & Version Control
  { path: "/.git/config", category: "git", isSensitive: true, description: "Git repository configuration" },
  { path: "/.git/HEAD", category: "git", isSensitive: true, description: "Git current branch HEAD reference" },
  { path: "/.gitignore", category: "git", isSensitive: false, description: "Git ignore pattern list" },
  { path: "/.svn/entries", category: "git", isSensitive: true, description: "Subversion entries database" },
  { path: "/.DS_Store", category: "git", isSensitive: true, description: "macOS Finder directory metadata" },

  // Cloud & Private Keys
  { path: "/.aws/credentials", category: "keys", isSensitive: true, description: "AWS local credentials configuration" },
  { path: "/id_rsa", category: "keys", isSensitive: true, description: "Private SSH key (RSA)" },
  { path: "/id_rsa.pub", category: "keys", isSensitive: false, description: "Public SSH key" },
  { path: "/id_ecdsa", category: "keys", isSensitive: true, description: "Private SSH key (ECDSA)" },
  { path: "/.ssh/id_rsa", category: "keys", isSensitive: true, description: "SSH directory private key" },

  // CMS & Framework Backups
  { path: "/wp-config.php.bak", category: "config", isSensitive: true, description: "WordPress configuration backup" },
  { path: "/wp-config.php~", category: "config", isSensitive: true, description: "WordPress editor swap/temp file" },
  { path: "/wp-config.php.old", category: "config", isSensitive: true, description: "WordPress old configuration" },
  { path: "/wp-config.php.save", category: "config", isSensitive: true, description: "WordPress saved configuration" },
  { path: "/config.php~", category: "config", isSensitive: true, description: "PHP configuration editor swap file" },
  { path: "/config.php.bak", category: "config", isSensitive: true, description: "PHP configuration backup" },
  { path: "/configuration.php.bak", category: "config", isSensitive: true, description: "Joomla configuration backup" },
  { path: "/web.config", category: "config", isSensitive: true, description: "IIS web configuration" },

  // Backups & SQL Dumps
  { path: "/backup.zip", category: "backup", isSensitive: true, description: "Site or database archive" },
  { path: "/backup.tar.gz", category: "backup", isSensitive: true, description: "Gzipped site backup" },
  { path: "/dump.sql", category: "backup", isSensitive: true, description: "SQL database export dump" },
  { path: "/database.sql", category: "backup", isSensitive: true, description: "Database SQL dump" },
  { path: "/backup.sql", category: "backup", isSensitive: true, description: "Backup SQL file" },

  // Info & Debug Endpoints
  { path: "/phpinfo.php", category: "info", isSensitive: true, description: "PHP runtime environment details" },
  { path: "/info.php", category: "info", isSensitive: true, description: "Server information script" },
  { path: "/test.php", category: "info", isSensitive: true, description: "Test script often left behind" },
  { path: "/server-status", category: "info", isSensitive: true, description: "Apache server-status endpoint" },
  { path: "/server-info", category: "info", isSensitive: true, description: "Apache server-info endpoint" },
  { path: "/actuator", category: "info", isSensitive: true, description: "Spring Boot Actuator root endpoint" },
  { path: "/actuator/env", category: "info", isSensitive: true, description: "Spring Boot Actuator environment" },

  // Docker & IDE Configs
  { path: "/docker-compose.yml", category: "config", isSensitive: true, description: "Docker Compose service definitions" },
  { path: "/Dockerfile", category: "config", isSensitive: false, description: "Container build specification" },
  { path: "/.vscode/sftp.json", category: "config", isSensitive: true, description: "VSCode SFTP plugin credentials" },
  { path: "/.idea/workspace.xml", category: "config", isSensitive: false, description: "IntelliJ workspace configuration" },
  { path: "/package.json", category: "config", isSensitive: false, description: "Node.js dependencies and scripts" },
  { path: "/composer.json", category: "config", isSensitive: false, description: "PHP Composer package definition" },

  // API Specifications
  { path: "/swagger.json", category: "api", isSensitive: false, description: "Swagger / OpenAPI JSON specification" },
  { path: "/swagger.yaml", category: "api", isSensitive: false, description: "Swagger / OpenAPI YAML specification" },
  { path: "/openapi.json", category: "api", isSensitive: false, description: "OpenAPI 3.0 JSON specification" },
  { path: "/graphql", category: "api", isSensitive: false, description: "GraphQL endpoint" },

  // Public & Discovery Files
  { path: "/.well-known/security.txt", category: "public", isSensitive: false, description: "RFC 9116 security disclosure policy" },
  { path: "/security.txt", category: "public", isSensitive: false, description: "Security disclosure policy" },
  { path: "/robots.txt", category: "public", isSensitive: false, description: "Web crawler rules" },
  { path: "/sitemap.xml", category: "public", isSensitive: false, description: "Search engine sitemap index" },
  { path: "/crossdomain.xml", category: "public", isSensitive: false, description: "Adobe Flash cross-domain policy" },
];
