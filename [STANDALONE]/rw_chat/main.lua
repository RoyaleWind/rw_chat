

local isRDR = not TerraingridActivate and true or false
local loaded = false
local cmd = {}
local opened = false





RegisterNetEvent('rw_chat:addCommands')
AddEventHandler('rw_chat:addCommands', function(commands)

    local registeredCommands = GetRegisteredCommands()

    for _, command in ipairs(registeredCommands) do
        if IsAceAllowed(('command.%s'):format(command.name)) then
            table.insert(cmd, {
                command.name
            })
        end
    end

   TriggerServerEvent('rw_chat:serverCommands')

    loaded = true

end)


RegisterNetEvent('rw_chat:recieveCommands')
AddEventHandler('rw_chat:recieveCommands', function(commands)

    for _, command in ipairs(commands) do

        table.insert(cmd, {
            command.name
        })
        
    end
end)

Citizen.CreateThread(function()
while true do
    Citizen.Wait(10)
    if Config.close and (not opened)then
        Citizen.Wait(Config.time)
        if (not opened) then
            SendNUIMessage({action = 'hide_messages'})  
        end
    end   
end 

end)

RegisterNUICallback("chatout", function(data)
    if opened then
       opened = false
    end
end)


Citizen.CreateThread(function()
    SetTextChatEnabled(false)
    TriggerEvent('rw_chat:addCommands')

    if loaded then
        

        while true do
            Citizen.Wait(0)

            if IsControlPressed(0, isRDR and `INPUT_MP_TEXT_CHAT_ALL` or 245) --[[ INPUT_MP_TEXT_CHAT_ALL ]] then
                SetNuiFocus(true, true)
                opened = true
                for k,v in pairs(Config.ChatTypes) do
                    SendNUIMessage({
                        action = 'show_messsages'
                    })
                    SendNUIMessage({
                        action = 'show',
                        chat_types = Config.ChatTypes,
                        commands = cmd
                    })
                end
            end

        end
    end          

end)

RegisterNetEvent('rw_chat:regmsg')
AddEventHandler('rw_chat:regmsg', function(data)
    SendNUIMessage({
        action = 'msg',
        type = data.type,
        msg = data.msg,
        sender_data = {rp_name = data.name, steam_name = data.steam_name, phone_number = data.phone}
    })

end)

RegisterNetEvent('rw_chat:notphone')
AddEventHandler('rw_chat:notphone', function()

end)

RegisterNUICallback("mobile", function(data)
   local type = data.action
   local number = data.number
end)


RegisterNUICallback("send", function(data)
   
    if data.msg:sub(1, 1) == '/' then
        ExecuteCommand(data.msg:sub(2))
    else
       TriggerServerEvent('rw_chat:sendmsg', data)
    end

end)

RegisterNUICallback("hide", function(data)
   SetNuiFocus(false, false)
end)