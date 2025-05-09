[![npm](https://img.shields.io/npm/v/todoist-api-mcp)](https://www.npmjs.com/package/todoist-api-mcp)

# 📝 Todoist-API-MCP

MCP server for Todoist API integration. Provides full access to Todoist functionality through a simple and convenient MCP protocol.

## Key Features

- 🔄 **Transport flexibility**: support for various transport types - stdio, SSE, and HTTP Stream for different use cases
- 👥 **Multi-user mode**: in SSE/HTTP Stream modes, each client uses their own Todoist API token
- 🔒 **Security**: ability to restrict server access using an MCP Access token
- 🚀 **Complete API**: support for all main Todoist entities (tasks, projects, sections, labels, comments)

## Quick Start

```json
{
  "mcpServers": {
    "todoist": {
      "command": "npx",
      "args": ["todoist-api-mcp", "--mode", "stdio"],
      "env": {
        "TODOIST_API_TOKEN": "your_todoist_api_token"
      }
    }
  }
}
```

### Advanced usage

```bash
# stdio mode (for single user)
npx todoist-api-mcp --mode stdio --todoist-token YOUR_TODOIST_API_TOKEN

# SSE mode (for multi-user access)
# Clients send their Todoist tokens via Authorization: Bearer TOKEN header
npx todoist-api-mcp --mode sse

# HTTP Stream mode (for multi-user access)
# Clients send their Todoist tokens via Authorization: Bearer TOKEN header
npx todoist-api-mcp --mode httpStream

# With MCP Access token restriction
npx todoist-api-mcp --mode sse --mcp-access-token YOUR_MCP_ACCESS_TOKEN

# Setting the port for HTTP modes
npx todoist-api-mcp --mode sse --port 8080
```

## Transport Modes

- **stdio**: local mode for working through standard input/output streams. The Todoist API token is passed through the `--todoist-token` parameter or the `TODOIST_API_TOKEN` environment variable.

- **sse** (Server-Sent Events): HTTP mode with event support for multiple clients. Each client uses their own Todoist API token via the `Authorization: Bearer TOKEN` header. Server access can be restricted through an MCP Access token (`--mcp-access-token`), which is verified in the `X-Mcp-Token` header.

- **httpStream**: streaming HTTP mode for long-lived connections. Each client uses their own Todoist API token via the `Authorization: Bearer TOKEN` header. Server access can be restricted through an MCP Access token (`--mcp-access-token`), which is verified in the `X-Mcp-Token` header.

## Available Tools

### ✅ Tasks

- **Reading**: retrieving task lists and detailed information
- **Creating**: adding new tasks with support for all Todoist parameters
- **Updating**: changing any parameters of existing tasks
- **Closing/Opening**: managing task completion status
- **Deleting**: completely removing tasks from Todoist

### 📁 Projects

- **Reading**: retrieving project lists and their contents
- **Creating**: adding new projects with parameter configuration
- **Updating**: changing parameters of existing projects
- **Deleting**: completely removing projects from Todoist

### 📋 Sections

- **Reading**: retrieving section lists and their contents
- **Creating**: adding new sections to projects
- **Updating**: changing parameters of existing sections
- **Deleting**: removing sections from projects

### 🏷️ Labels

- **Reading**: retrieving label lists
- **Creating**: adding new labels
- **Updating**: changing parameters of existing labels
- **Deleting**: removing labels from Todoist

### 💬 Comments

- **Reading**: retrieving comments for tasks and projects
- **Creating**: adding new comments
- **Updating**: changing comment content
- **Deleting**: removing comments

## License

MIT
