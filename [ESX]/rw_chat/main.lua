ESX = nil

local isRDR = not TerraingridActivate and true or false
local loaded = false
local cmd = {}
local opened = false


Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
        Citizen.Wait(0)
    end

    while ESX.GetPlayerData().job == nil do
        Citizen.Wait(10)
    end

    PlayerData = ESX.GetPlayerData()
 
end)


RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function (xPlayer)
	PlayerData = xPlayer
end)

RegisterNetEvent("esx:setJob")
AddEventHandler("esx:setJob", function(job)
    PlayerData.job = job
end)

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
    if Config.close and (not opened) then
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
ESX.ShowNotification('YOU DO NOT HAVE A PHONE')
end)

RegisterNUICallback("mobile", function(data)
   local type = data.action
   local number = data.number
   if type == 'sms' then
    ESX.UI.Menu.Open('dialog', GetCurrentResourceName(), 'onSms', {
        title = "Send SMS"
    }, function(data, menu)
        TriggerServerEvent('gcPhone:sendMessage', number, data.value)
        menu.close()
    end, function(data, menu)
        menu.close()
    end)
   elseif type == 'call' then
    TriggerServerEvent('gcPhone:startCall', number, '', '')
   end
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
