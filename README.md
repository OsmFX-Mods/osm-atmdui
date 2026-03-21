# OsmFX Mods ATM DUI - Ultra Realistic ATM System

[![OsmFX Mods Official Store](https://img.shields.io/badge/OsmFx%20Mods%20Official%20Store-FF8C00?style=for-the-badge&logo=shopify&logoColor=white)](https://osmfxmods.com)
[![Discord](https://img.shields.io/discord/889011029600780348?color=5865F2&label=Join%20our%20Discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/R8gdEmgRtz)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg?style=for-the-badge)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/osmfx)

A DUI-based ATM system for FiveM that renders a realistic banking interface directly onto in-game ATM textures. Framework agnostic with support for QBCore, ESX, and Qbox.

[![Watch the Showcase](https://img.shields.io/badge/YouTube-Watch%20Showcase-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/ZNTA8WO24S0)

> **Pro Tip:** Elevate your server's experience with more premium resources at [OsmFX Mods](https://osmfxmods.com). Join our [Discord](https://discord.gg/R8gdEmgRtz) for exclusive updates, and consider dropping a server boost for prioritized support!

## Quickstart Guide

1. Ensure the required dependency (`ox_lib`) is running on your server.
2. Drop the `osm-atmdui` folder into your server's `resources` directory.
3. Open `config.lua` and adjust the framework and preferences to match your server.
4. **(Recommended)** Add the `atm_receipt` item snippet provided below to your framework's shared items to enable interactive physical receipts.
5. Add `ensure osm-atmdui` to your `server.cfg`.
6. Start your server (or run `ensure osm-atmdui`). You are ready to go!

## Features

### Visual & Immersion
- **DUI Rendering** - Custom UI rendered directly on ATM screen textures
- **Scripted Camera** - Smooth camera transitions with mouse-based interaction
- **Realistic UI** - Bank-grade interface
- **Animations** - Card insertion, and cash dispensing animations
- **Sound Effects** - Keypad clicks, card sounds, transaction confirmations

### Banking Features
- **PIN Authentication** - 4-digit PIN with lockout protection
- **Withdraw** - Quick amounts ($20, $50, $100, $200, $500) + custom
- **Deposit** - Deposit cash to bank account
- **Transfer** - Transfer funds to other players by account number
- **Balance Check** - View current account balance
- **Interactive Receipt** - Players receive an `atm_receipt` physical item giving them a beautiful UI view of their transaction details.

### Technical Features
- **Framework Agnostic** - Works with QBCore, ESX, and Qbox, and bridge-support for other frameworks.
- **ox_lib Integration** - Uses ox_lib for DUI, callbacks, and native elements.
- **ox_target Support** - Target-based interaction (configurable)
- **Secure** - Server-side validation for all transactions
- **Configurable** - Extensive configuration options

## Dependencies

- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql) (optional, for transaction logging)

### Optional
- [ox_target](https://github.com/overextended/ox_target) (if using target interaction)

## Installation

1. Download and extract to your resources folder
2. Ensure `ox_lib` is started before this resource
3. Add `ensure osm-atmdui` to your server.cfg
4. Configure `config.lua` as needed

## Configuration

### Framework Detection
```lua
Config.Framework = 'auto'  -- 'auto', 'qbcore', 'esx', 'qbox'
```

### Supported ATM Prop Models & Offsets
```lua
-- Add offsets unique to different map props to ensure the screen matches map scale/skew
Config.ATMModels = {
    ['prop_atm_01'] = { offset = vec3(0.0, 0.05, 0.65), scale = 0.06, width = 1024, height = 1024 },
    ['prop_atm_02'] = { offset = vec3(0.0, 0.05, 0.65), scale = 0.06, width = 1024, height = 1024 },
    ['prop_atm_03'] = { offset = vec3(0.0, 0.15, 0.67), scale = 0.055, width = 1024, height = 1024 },
    ['prop_fleeca_atm'] = { offset = vec3(0.0, 0.1, 0.7), scale = 0.04, width = 1024, height = 1024 }
}
```

### PIN Settings
```lua
Config.PIN = {
    length = 4,
    maxAttempts = 3,
    lockoutTime = 300,  -- seconds
    requireCard = true,  -- require bank_card item
}
```

### Transaction Limits
```lua
Config.Transactions = {
    quickAmounts = {20, 50, 100, 200, 500},
    maxWithdraw = 10000,
    maxDeposit = 50000,
    maxTransfer = 25000,
    fee = 0,
    feePercent = 0,
}
```

## Bank Card Item

For PIN verification, players need a `bank_card` item with metadata containing the PIN. This is already shipped with most frameworks like QBCore and QBOX.

### ATM Receipt Item

Add the `atm_receipt` item to your framework's item list to enable the in-game physical receipt UI feature:

### QBCore/Qbox
```lua
-- In qb-core/shared/items.lua
    atm_receipt = {
        name = 'atm_receipt',
        label = 'ATM Receipt',
        weight = 0.1,
        type = 'item',
        image = 'atm_receipt.png',
        unique = true,
        useable = true,
        shouldClose = true,
        combinable = nil,
        description = 'A receipt from the ATM'
    },
```

### Card Metadata Structure
```lua
info = {
    cardPin = 1234,  -- 4-digit PIN
    cardNumber = "4532123456789012", -- optional
    citizenid = "ABC12345" -- optional
}
```

## Framework Adapters

The script includes adapters for:

### QBCore (`bridge/client/qbcore.lua`, `bridge/server/qbcore.lua`)
- Uses `qb-core` exports for player data and money management
- Supports `QBCore.Functions.Notify` for notifications
- Uses `QBCore.Functions.HasItem` for inventory checks

### ESX (`bridge/client/esx.lua`, `bridge/server/esx.lua`)
- Uses `es_extended` exports
- Supports both default ESX inventory and ox_inventory
- Uses `ESX.ShowNotification` for notifications

### Qbox (`bridge/client/qbox.lua`, `bridge/server/qbox.lua`)
- Uses `qbx_core` exports
- Uses `ox_inventory` for item management
- Uses `lib.notify` for notifications

## Customizing the UI

The UI has been rewritten natively using **React, TypeScript, TailwindCSS, and Framer Motion** for high-performance and incredibly smooth animations. It renders a modern, responsive layout that functions seamlessly both as a 3D texture overlay (DUI) and a full-screen native browser UI (NUI).

To edit the UI:
1. Navigate to the `web/` directory.
2. Ensure you have Node.js installed and run `npm install`.
3. Modify the source code inside `web/src/`.
4. Run `npm run build` to compile the changes to the `html/` folder format readable by FiveM.
5. Restart the resource in-game with `ensure osm-atmdui`.

## Events

### Client Events
```lua
-- Button clicked in ATM UI
AddEventHandler('atm-dui:client:buttonClicked', function(buttonId)
    -- Handle button click
end)

-- ATM session ended
AddEventHandler('atm-dui:client:sessionEnded', function()
    -- Session cleanup
end)
```

### Server Callbacks
```lua
-- Verify PIN
lib.callback.register('atm-dui:server:verifyPIN', function(source, pin) ... end)

-- Withdraw
lib.callback.register('atm-dui:server:withdraw', function(source, amount) ... end)

-- Deposit
lib.callback.register('atm-dui:server:deposit', function(source, amount) ... end)

-- Transfer
lib.callback.register('atm-dui:server:transfer', function(source, target, amount) ... end)
```

## Exports

### Client Exports
```lua
-- Start ATM session programmatically
exports['osm-atmdui']:StartSession(atmEntity)

-- End current session
exports['osm-atmdui']:EndSession()
```

## Credits

- DUI implementation inspired by [colbss_keypad](https://github.com/colbss/colbss_keypad) and [cr-3dnui](https://github.com/cody-raves/cr-3dnui) and [benite-atm](https://github.com/FuTTiiZ/benite-atm) 
- Design references from [0BugScripts](https://www.youtube.com/watch?v=FHSppY6lfFc)
- Idea suggested on our [discord](https://discord.gg/R8gdEmgRtz) by french_fab

---
*Built with caffeine, code, and a help from our AI overlords (Claude Opus 4.5, Opus 4.6 and Gemini 3.1 Pro). The bugs, however, are 100% human-made.*