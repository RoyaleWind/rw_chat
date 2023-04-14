fx_version 'bodacious'
game 'gta5'

ui_page 'ui/ui.html'

author 'RoyaleWind'
description 'MODERN CHAT'

files {
	'ui/ui.html',
	'ui/js/*.js',
	'ui/css/*.css',
	'ui/images/icons/*.png',
	'ui/css/fonts/*.ttf',
}

shared_scripts {
  'config.lua'
}

server_scripts {
	'@mysql-async/lib/MySQL.lua',
	'server.lua',
}


client_scripts {
  'main.lua',
}
