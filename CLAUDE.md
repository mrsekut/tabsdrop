# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
TabsDrop is a Chrome extension that enables users to save multiple browser tabs to Raindrop.io simultaneously. Built with Plasmo framework, React, and TypeScript.

## Development Commands

```bash
# Development
yarn dev        # Start development server with hot reload

# Build
yarn build      # Build production extension

# Package
yarn package    # Create extension package for distribution
```

## Architecture

### Extension Structure
- **Popup** (`src/popup.tsx`): Entry point that handles authentication check and renders TabSaver
- **Background Service** (`src/background.ts`): Monitors tab changes and updates badge indicators for saved items
- **Options Page** (`src/options.tsx`): Settings page for Raindrop.io authentication
- **Content Script** (`src/contents/plasmo.ts`): Minimal content script setup

### Core Components
- **TabSaver** (`src/TabSaver.tsx`): Main UI component that displays selected tabs and their save status
- **Raindrop Integration** (`src/features/Raindrop/`): Handles OAuth authentication and API calls to Raindrop.io
- **Tab Management** (`src/features/tabs/`): State management using Jotai for handling multiple tabs

### State Management
Uses Jotai atoms for reactive state:
- `tabAtom`: Individual tab data
- `tabIdsAtom`: List of selected tab IDs
- `tabStatusAtom`: Save status per tab (saving/saved/error)
- `saveItemAtom`: Action atom for saving tabs

### Authentication Flow
1. User clicks extension → Check auth status
2. If not authenticated → Redirect to options page
3. OAuth flow with Raindrop.io via Chrome identity API
4. Token stored in Chrome storage with refresh capability

### TypeScript Configuration
Strict mode enabled with additional safety checks:
- No implicit any
- No unchecked indexed access
- Exact optional property types
- All unused variables/parameters flagged