
RegisterServerEvent('rw_chat:serverCommands')
AddEventHandler('rw_chat:serverCommands', function()

  local src = source
	local commands = GetRegisteredCommands()

  TriggerClientEvent('rw_chat:recieveCommands', src, commands)
  
end)

 RegisterServerEvent('rw_chat:sendmsg')
 AddEventHandler('rw_chat:sendmsg', function(data)

    local src = source

  
     cmd = '['..src..'/'..GetPlayerName(src)..']'

     local info = {
      type = data.type,
      msg = data.msg,
      name = GetPlayerName(src),
      steam_name = GetPlayerName(src),
      phone = "11000",
      cmd = cmd,
     }

     if data.type == 'twitter' then
      TriggerEvent("rw_chat:sendall", info)
      color = 1752220
      TriggerEvent("rw_chat:senlog", info, color)
elseif data.type == 'ad' then
      TriggerEvent("rw_chat:sendall", info)
      color = 15844367
      TriggerEvent("rw_chat:senlog", info, color)
elseif data.type == 'staff_announce' then
      if ISADMIN(src) then 
      TriggerEvent("rw_chat:sendall", info)
      color = 15158332
      TriggerEvent("rw_chat:senlog", info, color)
      end  
elseif data.type == 'staff_chat' then
      if ISADMIN(src) then 
      TriggerEvent("rw_chat:senstaff", info)
      color = 15158332
      TriggerEvent("rw_chat:senlog", info, color)
      end  
elseif data.type == 'police' then
     if HASJOB(src) == 'police' then
     TriggerEvent("rw_chat:sendall", info)
     color = 2899536
     TriggerEvent("rw_chat:senlog", info, color)
     end  
elseif data.type == 'ambulance' then
     if HASJOB(src) == 'ambulance' then
     TriggerEvent("rw_chat:sendall", info)
     color = 15158332
     TriggerEvent("rw_chat:senlog", info, color)
     end  
elseif data.type == 'robb' then
     TriggerEvent("rw_chat:sendall", info)
     color = 9807270
     TriggerEvent("rw_chat:senlog", info, color)
elseif data.type == 'dark_chat' then
     TriggerEvent("rw_chat:sendall", info)
     color = 0000
     TriggerEvent("rw_chat:senlog", info, color)
elseif data.type == 'anon' then
    TriggerEvent("rw_chat:sendall", info)
    color = 12370112
    TriggerEvent("rw_chat:senlog", info, color)
elseif data.type == 'job' then
    TriggerEvent("rw_chat:sendall", info)
    color = 15844367
    TriggerEvent("rw_chat:senlog", info, color)
elseif data.type == 'support' then
    if ISADMIN(src) then 
    TriggerEvent("rw_chat:sendall", info)
    color = 3066993
    TriggerEvent("rw_chat:senlog", info, color)
    end  
elseif data.type == 'event' then
    if ISADMIN(src) then 
    TriggerEvent("rw_chat:sendall", info)
    color = 11342935
    TriggerEvent("rw_chat:senlog", info, color)
    end  
elseif data.type == 'info' then
    if ISADMIN(src) then 
    TriggerEvent("rw_chat:sendall", info)
    color = 1752220
    TriggerEvent("rw_chat:senlog", info, color)
    end
end       

end)

RegisterNetEvent('rw_chat:sendall')
AddEventHandler('rw_chat:sendall', function(data)
  for _, v in ipairs(GetPlayers()) do
  
    if ISADMIN(v) then
    local info = {
      type = data.type,
      msg = data.cmd..' '..data.msg,
      name = data.name,
      steam_name = data.steam_name,
      phone = data.phone
     }
     TriggerClientEvent('rw_chat:regmsg', v, info)
    else 
     local info = {
      type = data.type,
      msg = data.msg,
      name = data.name,
      steam_name = data.steam_name,
      phone = data.phone
     }
     TriggerClientEvent('rw_chat:regmsg', v, info)
     end 
  end 
end)

RegisterNetEvent('rw_chat:senlog')
AddEventHandler('rw_chat:senlog', function(data, color)
  local time = '22:00'
	local date = '00/00/2022'
  time = os.date("%H:%M", os.time() + 1 * 60 * 60 )
  date = os.date("%d/%m/%Y",os.time() + 1 * 60 * 60 ) 
  local cmessagem = data.cmd..''..data.msg
  local ctime = time..' '..date
  local ccolor = color
  local cname = data.type 
  local content = {{
  author = {
  name = cname,
  icon_url = 'https://cdn.discordapp.com/attachments/1001100610646573107/1009751383865561088/hu-tao.gif'
  },
  ["color"] = ccolor,
  ["description"] = cmessagem,
  ["footer"] = {
  ["text"] = ctime,
  },}}
  PerformHttpRequest(Config.Webhook, function() end, 'POST', json.encode({embeds = content}), { ['Content-Type'] = 'application/json' })
end)

function ISADMIN(id) 
 return false
end  

function HASJOB(id) 
  local temp 
  temp = "nojob"
  return temp
end  