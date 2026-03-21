Config = {}

-- Framework detection: 'auto', 'qbcore', 'esx', 'qbox'
Config.Framework = 'auto'
Config.Debug = false -- Enable debug prints

-- ATM Models that will have DUI applied
Config.ATMModels = {
    'prop_atm_01',
    'prop_atm_02', 
    'prop_atm_03',
    'prop_fleeca_atm'
}

-- Prop positioning by ATM Model (X = Left/Right, Y = Forward/Back, Z = Up/Down)
Config.PropOffsets = {
    ['prop_fleeca_atm'] = {
        dispense = { x = -0.11, startY = 0.15, endY = -0.15, z = 0.95 },
        deposit = { x = -0.10, startY = -0.15, endY = 0.15, z = 0.95 },
        card = { x = 0.25, startY = -0.10, endY = 0.20, z = 1.2 }
    },
    ['prop_atm_01'] = {
        dispense = { x = -0.05, startY = -0.20, endY = -0.35, z = 0.75 },
        deposit = { x = -0.05, startY = -0.35, endY = -0.20, z = 0.95 },
        card = { x = 0.20, startY = -0.25, endY = 0.05, z = 1.12 }
    },
    ['prop_atm_02'] = {
        dispense = { x = -0.11, startY = 0.15, endY = -0.15, z = 0.95 },
        deposit = { x = -0.10, startY = -0.15, endY = 0.15, z = 0.95 },
        card = { x = 0.25, startY = -0.10, endY = 0.20, z = 1.20 }
    },
    ['prop_atm_03'] = {
        dispense = { x = -0.11, startY = 0.15, endY = -0.15, z = 0.95 },
        deposit = { x = -0.10, startY = -0.15, endY = 0.15, z = 0.95 },
        card = { x = 0.25, startY = -0.10, endY = 0.20, z = 1.2 }
    }
}

-- Texture replacement settings
Config.TextureDict = 'prop_atm_01'
Config.TextureName = 'atm_screen'

-- DUI Settings
Config.DUI = {
    width = 1326,
    height = 1004,
}

-- Camera Settings
Config.Camera = {
    transitionTime = 500,       -- ms for camera transition
    fov = 45.0,                 -- Field of view (slightly narrower for better framing)
    distance = 0.65,            -- Distance from ATM (slightly further for full view)
    heightOffset = 1.45,        -- Height offset (player eye-level, ~1.55m from ATM base)
    sideOffset = -0.1,           -- Side offset (Left/Right)
    initialPitch = -15.0,       -- Initial downward angle (negative = looking down at ATM)
    mouseSensitivity = 4.0,     -- Camera rotation sensitivity
    -- Rotation limits (degrees from initial rotation)
    pitchUp = 18.0,             -- How far up from initial (to see top of screen)
    pitchDown = 55.0,           -- How far down from initial (to reach bottom keypad row)
    yawRange = 30.0,            -- How far left/right from initial (wide enough for side buttons)
}

-- Physical ATM Keypad Button Positions
-- Each button is defined as a 3D offset (x, y, z) from the ATM entity origin.
-- These offsets are in the ATM entity's local coordinate system.
-- They get quaternion-rotated by the entity heading to produce world positions,
-- then projected to screen coordinates to check if the crosshair (screen center) is near them.
Config.ButtonProximity = 0.027  -- Screen-space distance threshold for hit detection

-- Button offsets per ATM model (from benite-atm reference, verified accurate)
Config.ButtonOffsets = {
    ['prop_fleeca_atm'] = {
        -- Side buttons (left and right of screen)
        { id = 'side_l1', offset = vector3(-0.306, 0.1, 1.23) },
        { id = 'side_l2', offset = vector3(-0.306, 0.095, 1.17) },
        { id = 'side_l3', offset = vector3(-0.306, 0.09, 1.11) },
        { id = 'side_l4', offset = vector3(-0.306, 0.08, 1.06) },
        { id = 'side_r1', offset = vector3(0.065, 0.1, 1.23) },
        { id = 'side_r2', offset = vector3(0.065, 0.095, 1.17) },
        { id = 'side_r3', offset = vector3(0.064, 0.085, 1.11) },
        { id = 'side_r4', offset = vector3(0.063, 0.07, 1.055) },
        -- Number pad
        { id = 'pin_1',     offset = vector3(-0.173, 0.0, 0.88) },
        { id = 'pin_2',     offset = vector3(-0.145, 0.0, 0.88) },
        { id = 'pin_3',     offset = vector3(-0.122, 0.0, 0.88) },
        { id = 'pin_4',     offset = vector3(-0.173, -0.04, 0.87) },
        { id = 'pin_5',     offset = vector3(-0.145, -0.04, 0.87) },
        { id = 'pin_6',     offset = vector3(-0.122, -0.04, 0.87) },
        { id = 'pin_7',     offset = vector3(-0.173, -0.075, 0.865) },
        { id = 'pin_8',     offset = vector3(-0.145, -0.075, 0.865) },
        { id = 'pin_9',     offset = vector3(-0.122, -0.075, 0.865) },
        { id = 'pin_0',     offset = vector3(-0.145, -0.12, 0.865) },
        { id = 'pin_clear', offset = vector3(-0.182, -0.12, 0.865) },
        { id = 'pin_enter', offset = vector3(-0.108, -0.12, 0.865) },
    },
    ['prop_atm_01'] = {
        { id = 'side_l1', offset = vector3(-0.19, -0.11, 1.14) },
        { id = 'side_l2', offset = vector3(-0.19, -0.115, 1.1) },
        { id = 'side_l3', offset = vector3(-0.19, -0.122, 1.06) },
        { id = 'side_l4', offset = vector3(-0.19, -0.129, 1.02) },
        { id = 'side_r1', offset = vector3(0.084, -0.11, 1.14) },
        { id = 'side_r2', offset = vector3(0.084, -0.115, 1.1) },
        { id = 'side_r3', offset = vector3(0.084, -0.122, 1.06) },
        { id = 'side_r4', offset = vector3(0.084, -0.129, 1.02) },
        { id = 'pin_1',     offset = vector3(-0.089, -0.18, 0.89) },
        { id = 'pin_2',     offset = vector3(-0.058, -0.18, 0.89) },
        { id = 'pin_3',     offset = vector3(-0.027, -0.18, 0.89) },
        { id = 'pin_4',     offset = vector3(-0.089, -0.2, 0.87) },
        { id = 'pin_5',     offset = vector3(-0.058, -0.2, 0.87) },
        { id = 'pin_6',     offset = vector3(-0.027, -0.2, 0.87) },
        { id = 'pin_7',     offset = vector3(-0.089, -0.22, 0.855) },
        { id = 'pin_8',     offset = vector3(-0.058, -0.22, 0.855) },
        { id = 'pin_9',     offset = vector3(-0.027, -0.22, 0.855) },
        { id = 'pin_0',     offset = vector3(-0.058, -0.243, 0.838) },
        { id = 'pin_clear', offset = vector3(-0.089, -0.243, 0.838) },
        { id = 'pin_enter', offset = vector3(-0.027, -0.243, 0.838) },
    },
    ['prop_atm_02'] = {
        { id = 'side_l1', offset = vector3(-0.306, 0.1, 1.23) },
        { id = 'side_l2', offset = vector3(-0.306, 0.095, 1.17) },
        { id = 'side_l3', offset = vector3(-0.306, 0.09, 1.11) },
        { id = 'side_l4', offset = vector3(-0.306, 0.076, 1.05) },
        { id = 'side_r1', offset = vector3(0.065, 0.1, 1.23) },
        { id = 'side_r2', offset = vector3(0.065, 0.095, 1.17) },
        { id = 'side_r3', offset = vector3(0.064, 0.085, 1.11) },
        { id = 'side_r4', offset = vector3(0.063, 0.07, 1.055) },
        { id = 'pin_1',     offset = vector3(-0.173, 0.0, 0.88) },
        { id = 'pin_2',     offset = vector3(-0.145, 0.0, 0.88) },
        { id = 'pin_3',     offset = vector3(-0.122, 0.0, 0.88) },
        { id = 'pin_4',     offset = vector3(-0.173, -0.04, 0.87) },
        { id = 'pin_5',     offset = vector3(-0.145, -0.04, 0.87) },
        { id = 'pin_6',     offset = vector3(-0.122, -0.04, 0.87) },
        { id = 'pin_7',     offset = vector3(-0.173, -0.075, 0.865) },
        { id = 'pin_8',     offset = vector3(-0.145, -0.075, 0.865) },
        { id = 'pin_9',     offset = vector3(-0.122, -0.075, 0.865) },
        { id = 'pin_0',     offset = vector3(-0.145, -0.12, 0.865) },
        { id = 'pin_clear', offset = vector3(-0.076, 0.0, 0.88) },
        { id = 'pin_enter', offset = vector3(-0.076, -0.075, 0.865) },
    },
    ['prop_atm_03'] = {
        { id = 'side_l1', offset = vector3(-0.306, 0.095, 1.23) },
        { id = 'side_l2', offset = vector3(-0.306, 0.080, 1.17) },
        { id = 'side_l3', offset = vector3(-0.306, 0.065, 1.11) },
        { id = 'side_l4', offset = vector3(-0.306, 0.050, 1.05) },
        { id = 'side_r1', offset = vector3(0.065, 0.095, 1.23) },
        { id = 'side_r2', offset = vector3(0.065, 0.080, 1.17) },
        { id = 'side_r3', offset = vector3(0.064, 0.065, 1.11) },
        { id = 'side_r4', offset = vector3(0.063, 0.050, 1.055) },
        { id = 'pin_1',     offset = vector3(-0.181, -0.02, 0.88) },
        { id = 'pin_2',     offset = vector3(-0.153, -0.02, 0.88) },
        { id = 'pin_3',     offset = vector3(-0.116, -0.02, 0.88) },
        { id = 'pin_4',     offset = vector3(-0.181, -0.06, 0.87) },
        { id = 'pin_5',     offset = vector3(-0.153, -0.06, 0.87) },
        { id = 'pin_6',     offset = vector3(-0.116, -0.06, 0.87) },
        { id = 'pin_7',     offset = vector3(-0.181, -0.085, 0.865) },
        { id = 'pin_8',     offset = vector3(-0.153, -0.085, 0.865) },
        { id = 'pin_9',     offset = vector3(-0.116, -0.085, 0.865) },
        { id = 'pin_0',     offset = vector3(-0.153, -0.122, 0.865) },
        { id = 'pin_clear', offset = vector3(-0.076, -0.02, 0.88) },
        { id = 'pin_enter', offset = vector3(-0.076, -0.077, 0.865) },
    },
}

-- PIN Settings
Config.PIN = {
    length = 4,                 -- PIN digit length
    maxAttempts = 3,            -- Max failed attempts before card lock
    lockoutTime = 300,          -- Seconds to lock card after max attempts
    requireCard = true,         -- Require bank card item to use ATM
}

-- Transaction Settings  
Config.Transactions = {
    quickAmounts = {20, 50, 100, 200, 500}, -- Quick withdrawal amounts
    maxWithdraw = 10000,        -- Max single withdrawal
    maxDeposit = 50000,         -- Max single deposit
    maxTransfer = 25000,        -- Max single transfer
    fee = 0,                    -- Transaction fee (0 = no fee)
    feePercent = 0,             -- Transaction fee percentage
}

-- Sound Settings
Config.Sounds = {
    enabled = true,
    volume = 0.5,
    cardInsert = 'card_insert',
    cardEject = 'card_eject', 
    keyPress = 'key_press',
    success = 'success',
    error = 'error',
    cashDispense = 'cash_dispense',
}

-- Interaction Settings
Config.Interaction = {
    useTarget = true,           -- Use ox_target (false = proximity key)
    useQBTarget = false,          -- Use qb-target if true (ox-target otherwise)
    interactKey = 38,           -- E key for proximity
    interactDistance = 1.5,     -- Distance to interact
}

-- Animation Settings
Config.Animation = {
    dict = 'amb@prop_human_atm@male@idle_a',
    anim = 'idle_a',
    cardDict = 'amb@prop_human_atm@male@enter',
    cardAnim = 'enter',
}

-- UI Customization
Config.UI = {
    bankName = 'FLEECA',
    language = 'en',            -- UI language
}

-- Locales
Config.Locales = {
    en = {
        insert_card = 'Please Insert Your Card',
        enter_pin = 'Enter Your PIN',
        welcome = 'Welcome',
        main_menu = 'Select Transaction',
        withdraw = 'Withdraw',
        deposit = 'Deposit',
        transfer = 'Transfer',
        balance = 'Check Balance',
        exit = 'Exit',
        quick_cash = 'Quick Cash',
        other_amount = 'Other Amount',
        enter_amount = 'Enter Amount',
        confirm = 'Confirm',
        cancel = 'Cancel',
        back = 'Back',
        success = 'Transaction Successful',
        error = 'Transaction Failed',
        insufficient_funds = 'Insufficient Funds',
        invalid_pin = 'Invalid PIN',
        invalid_amount = 'Invalid Amount',
        card_locked = 'Card Locked - Contact Bank',
        take_card = 'Please Take Your Card',
        take_cash = 'Please Take Your Cash',
        receipt_question = 'Do You Want a Receipt?',
        yes = 'Yes',
        no = 'No',
        current_balance = 'Current Balance',
        transaction_complete = 'Transaction Complete',
        processing = 'Processing...',
        enter_account = 'Enter Account Number',
        transfer_to = 'Transfer To',
        amount = 'Amount',
        available_balance = 'Available Balance',
        attempts_remaining = 'Attempts Remaining',
    }
}
