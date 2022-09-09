var totalMessages = 0;
var currentChat = 'twitter';
var chat_types = [];
var commands = [];
var chat_types_arr = [];
var chat_type_index = -1;
var lastCommands = [];
var lastCommandIndex = 0;
var saveLastCommandIndex = 0;
var pressedCommandsAtLeastOnce = [];
var commandSuggestions = [];

$(window).ready(function() {
    
    listener();

    document.onkeyup = function(event) {
		if (event.key == 'Escape') {
			hideUI();
		}
	};
    $(window).on('keyup', function (e){
        if (e.key == "Control"){
            if ($("#input_box").val() == ""){
                chat_type_index++;
                if (chat_type_index > chat_types_arr.length - 1){
                    chat_type_index = 0;
                }
                currentChat = chat_types_arr[chat_type_index];
                if (chat_types[currentChat]){
                    $(".strain-input").css("color",chat_types[currentChat].colour);
                }
                if (currentChat){
                    $(".strain-input").attr("placeholder","Current Chat: "+currentChat+". You can change this if you press left CTRL.");
                }
                
                $("#input_box").focus();
            }     
           
        }else if(e.key == "F11"){
            $.post(`https://${GetParentResourceName()}/mousedisabled`);
        }
    });
    $('#input_box').focusout(function(){
        $('#input_box').focus();
    });
    $("#input_box").on('keyup', function (e) {
        if (e.key === 'Enter' || e.key == "Backspace") {
            var text = $("#input_box").val();
            if (text == ""){
                if (e.key === 'Enter'){
                   hideUI();
                }
                
                return;
            }
            if (e.key == "Backspace" && text.length > 0){
                applysuggestions()
                return;
            }
           
            $("#recommended-commands").html(``);
            let command = getCommand()
            if (command){
                if (chat_types[command]){
                    currentChat = command;
                    if (chat_types[currentChat]){
                        $(".strain-input").css("color",chat_types[command].colour);
                    }
                    if (currentChat){
                        $(".strain-input").attr("placeholder","Current Chat: "+currentChat+". You can change this if you press left CTRL.");
                    }


                }else{
                    if (pressedCommandsAtLeastOnce[text] == undefined){
                        pressedCommandsAtLeastOnce[text] = true;
                        lastCommands.push({
                            currentChat : currentChat,
                            text : text
                        })
                        lastCommandIndex++;
                        saveLastCommandIndex = lastCommandIndex;
                    }
                  
                    $.post(`https://${GetParentResourceName()}/send`,JSON.stringify({
                        command : command,
                        msg : text,
                        type : currentChat,
                    }));

                  hideUI();
                }
            }else{
                lastCommands.push({
                    currentChat : currentChat,
                    text : text
                })
                lastCommandIndex++;
                saveLastCommandIndex = lastCommandIndex;
                
                $.post(`https://rw_chat/send`,JSON.stringify({
                    msg : text,
                    type : currentChat
                }));

                /// for mesage not command
               hideUI();
        
     
            }
            
           
            $("#input_box").val("");
            
        }else if(e.key == "ArrowUp"){
            
            if (lastCommands[lastCommandIndex - 1]){
                lastCommandIndex--;
                currentChat = lastCommands[lastCommandIndex].currentChat
                if (chat_types[currentChat]){
                    $(".strain-input").css("color",chat_types[currentChat].colour);
                }
                if (currentChat){
                    $(".strain-input").attr("placeholder","Current Chat: "+currentChat+". You can change this if you press left CTRL.");
                }

                $("#input_box").val(lastCommands[lastCommandIndex].text);
            }
        }else if(e.key == "ArrowDown"){
            if (lastCommands[lastCommandIndex + 1]){
                lastCommandIndex++;
                currentChat = lastCommands[lastCommandIndex].currentChat
                if (chat_types[currentChat]){
                    $(".strain-input").css("color",chat_types[currentChat].colour);
                }
                if (currentChat){
                    $(".strain-input").attr("placeholder","Current Chat: "+currentChat+". You can change this if you press left CTRL.");
                }
                $("#input_box").val(lastCommands[lastCommandIndex].text);
            }
        }else{
            applysuggestions(e);
        }
    
    });
});

/* function applysuggestions(){
    let currentcommand = getCommand();
    var commandsStartWith = [];
    let counter = 0;
    $("#recommended-commands").html(``);
    if (currentcommand){
        commands.forEach(function(value){
            if (value && value.startsWith(currentcommand)){
                commandsStartWith.push(value);
                if (counter == 0){
                    $("#recommended-commands").show();
                }
                if (currentcommand == value){
                    if (commandSuggestions[value]){
                        value = value + commandSuggestions[value];
                    }
                }
                counter++;
                
                if (counter <= 5){
                    $("#recommended-commands").append(`<span>/`+value+`</span>`);
                }
               
                
            } 
        })
       
    }
} */


function applysuggestions(event){
    let currentcommand = getCommand();
    // console.log(commands)
    // console.log(JSON.stringify(commands))
    var commandsStartWith = [];
    let counter = 0;
    $("#recommended-commands").html(``);
    if (currentcommand){
        
        //console.log(currentcommand)
        commands.map(command => {
            // console.log(command)
            // console.log();
            let data = command.toString()
            if(data.startsWith(currentcommand)){
                // console.log("elaa")
                $("#recommended-commands").show();
                $("#recommended-commands").append(`<span>/`+data+`</span>`);
                 $("#input_box").on('keyup', function (e) {
                //     // console.log(e.key)
                     if(e.key === 'ArrowRight'){
                //         console.log($( "input_box" ).html())
                         $("#input_box").val(`/${data}`)
                     }
                })
               
            }
        })

        // commands.forEach(function(command){
        //     console.log(command)
        //     console.log(command.toString());
        // })

        // commands.forEach((value) => {
        //     let data = value.toString()
        //     console.log(data)
        //     if (data && data.startsWith(currentcommand)){
                
        //         commandsStartWith.push(data);
        //         if (counter == 0){
        //             $("#recommended-commands").show();
        //         }
        //         if (currentcommand == data){
        //             data = data + '';
        //         }
        //         counter++;
                
        //         if (counter <= 5){
        //             $("#recommended-commands").append(`<span>/`+data+`</span>`);
        //         }
               
                
        //     } 
        // })
       
    }
}



function listener() {
    window.addEventListener('message', (event) => {
        if (event.data.action == "show"){
            chat_types = event.data.chat_types;
            commands = event.data.commands;
            
            chat_types_arr = [];
            Object.entries(chat_types).forEach(([chat_name]) => {
                chat_types_arr.push(chat_name);
            });
            chat_types_arr.forEach(function(value, index, array){
                if (value == currentChat){
                    chat_type_index = index;
                }
            })
            commandSuggestions = event.data.commandSuggestions;
            showUI();
        }else if(event.data.action == "msg"){
            totalMessages++;
            switch (event.data.type){
                case 'twitter':
                    sendTwitter(event.data.msg,event.data.sender_data);
                    break;
                case 'staff_announce':
                    sendStaffAnnounce(event.data.msg,event.data.sender_data);
                    break;
                case 'police':
                    sendPoliceMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'avocat':
                    sendAvocatMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'robb':
                    sendRobberyMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'ad':
                    sendAdMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'dark_chat':
                    sendDarkChatMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'anon':
                    sendAnonMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'trade':
                    sendTradeMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'job':
                    sendJobMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'support':
                    sendSupportMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'staff_chat':
                    sendStaffChatMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'event':
                    sendEventMessage(event.data.msg,event.data.sender_data);
                    break;
                case 'opap':
                    sendOpapMessge(event.data.msg,event.data.sender_data);
                    break;
                case 'info':
                    sendInfoMessge(event.data.msg,event.data.sender_data);
                    break;
                case 'ambulance':
                    sendAmbulance(event.data.msg,event.data.sender_data);
                    break;
                
            }
            if (totalMessages > 30){
                deleteFirstMessage();
            }
        }else if(event.data.action == "show_messsages"){
            showMessages();
        }else if(event.data.action == "hide_messages"){
            hideMessages();
        }else if(event.data.action == "clear_messages"){
            totalMessages = 0;
            clearChat();
        }else if(event.data.action == "visibility-keyguide"){
            if (event.data.visible){
                $("#left-keybinds").show();
            }else{
                $("#left-keybinds").hide();
            }
        }
    });
}

function sendAmbulance(msg){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-ems"><div id="category-text">EMS</div></div></td>
        <td class="ems-gradient">
            <div id="category-icon" class="icon-ems"><i class="fas fa-medkit"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendTwitter(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-twitter"><div id="category-text">TWITTER</div></div></td>
        <td class="twitter-gradient">
            <div id="category-icon" class="icon-twitter"><i class="fab fa-twitter"></i></div>
            <div id="chat-text">`+msg+`</div>
            <button id="contact-sender-phone" onclick = phone('`+sender_data.phone_number+`','call')><i class="fas fa-phone-alt"></i></button> <button id="contact-sender-sms" onclick = phone('`+sender_data.phone_number+`','sms')><i class="fas fa-comment-alt-lines"></i></button>
            <div id="sender-name">Sender: `+sender_data.rp_name+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendStaffAnnounce(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-staff-announce"><div id="category-text">STAFF ANNOUNCE</div></div></td>
        <td class="staff-announce-gradient">
            <div id="category-icon" class="icon-staff-announce"><i class="fas fa-bullhorn"></i></div>
            <div id="chat-text">[`+sender_data.steam_name+`] `+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendPoliceMessage(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-police"><div id="category-text">POLICE</div></div></td>
        <td class="police-gradient">
            <div id="category-icon" class="icon-police"><i class="fas fa-user-nurse"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendAvocatMessage(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-avocat"><div id="category-text">AVOCAT</div></div></td>
        <td class="avocat-gradient">
            <div id="category-icon" class="icon-avocat"><i class="fas fa-user-nurse"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendRobberyMessage(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-robbery"><div id="category-text">ROBBERY</div></div></td>
        <td class="robbery-gradient">
            <div id="category-icon" class="icon-robbery"><i class="fas fa-sack-dollar"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendAdMessage(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-advertisement"><div id="category-text">ADV.</div></div></td>
        <td class="advertisement-gradient">
            <div id="category-icon" class="icon-advertisement"><i class="fas fa-ad"></i></div>
            <div id="chat-text">`+msg+`</div>
            <button id="contact-sender-phone" onclick = phone('`+sender_data.phone_number+`','call')><i class="fas fa-phone-alt"></i></button> <button id="contact-sender-sms" onclick = phone('`+sender_data.phone_number+`','sms')><i class="fas fa-comment-alt-lines"></i></button>
            <div id="sender-name">Sender: `+sender_data.rp_name+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendDarkChatMessage(msg){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-dark-chat"><div id="category-text">DARK CHAT</div></div></td>
        <td class="dark-chat-gradient">
            <div id="category-icon" class="icon-dark-chat"><i class="fas fa-comment-alt-times"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendAnonMessage(msg){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-anon"><div id="category-text">ANON</div></div></td>
        <td class="anon-gradient">
            <div id="category-icon" class="icon-anon"><i class="fas fa-hockey-mask"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendTradeMessage(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-trade"><div id="category-text">TRADE</div></div></td>
        <td class="trade-gradient">
            <div id="category-icon" class="icon-trade"><i class="fas fa-exchange-alt"></i></div>
            <div id="chat-text">`+msg+`</div>
            <button id="contact-sender-phone" onclick = phone('`+sender_data.phone_number+`','call')><i class="fas fa-phone-alt"></i></button> <button id="contact-sender-sms" onclick = phone('`+sender_data.phone_number+`','sms')><i class="fas fa-comment-alt-lines"></i></button>
            <div id="sender-name">Sender: `+sender_data.rp_name+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendJobMessage(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-job"><div id="category-text">JOB</div></div></td>
        <td class="job-gradient">
            <div id="category-icon" class="icon-job"><i class="fas fa-user-hard-hat"></i></div>
            <div id="chat-text">`+msg+`</div>
            <button id="contact-sender-phone" onclick = phone('`+sender_data.phone_number+`','call')><i class="fas fa-phone-alt"></i></button> <button id="contact-sender-sms" onclick = phone('`+sender_data.phone_number+`','sms')><i class="fas fa-comment-alt-lines"></i></button>
            <div id="sender-name">Sender: `+sender_data.rp_name+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendSupportMessage(msg){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-support"><div id="category-text">SUPPORT</div></div></td>
        <td class="support-gradient">
            <div id="category-icon" class="icon-support"><i class="far fa-life-ring"></i></div>
            <div id="chat-text">Staff Answer: `+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendStaffChatMessage(msg,sender_data){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-staff-chat"><div id="category-text">STAFF CHAT</div></div></td>
        <td class="staff-chat-gradient">
            <div id="category-icon" class="icon-staff-chat"><i class="far fa-user-crown"></i></div>
            <div id="chat-text">`+msg+`</div>
            <div id="sender-name">Sender: `+sender_data.steam_name+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendEventMessage(msg){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-event"><div id="category-text">EVENT</div></div></td>
        <td class="event-gradient">
            <div id="category-icon" class="icon-event"><i class="fas fa-gift"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function sendInfoMessge(msg){
    let appendHtml = `
    <tr>
        <td><div id="chat-category" class="category-info"><div id="category-text">INFO</div></div></td>
        <td class="info-gradient">
            <div id="category-icon" class="icon-info"><i class="fas fa-info"></i></div>
            <div id="chat-text">`+msg+`</div>
        </td>
    </tr>
    `
    $("#chat_table").append(appendHtml);
}

function deleteFirstMessage(){
    totalMessages--;
    $("#chat_table").children().eq(0).remove();
    
}

function getCommand(){
    var text = $("#input_box").val();
    var command = "";
    if (text[0] == '/'){
        for (var i = 1; i < text.length; i++){
            if (text[i] == ' '){
                break;
            }else{
                command = command + text[i]
            }
        }
        return command;
    }else{
        return undefined;
    }
    
}

function phone(number,action){
    $.post(`https://${GetParentResourceName()}/mobile`,JSON.stringify({
        action : action,
        number : number
    }))
    hideUI();
}

function showUI(){
    $("#input_box").show();
    $("#input_box").focus();
    $("#arrow").show();
    if (chat_types[currentChat] == undefined){ //se periptwsi pou exei disabled to twt pou einai default allazei se kati allo random
        Object.entries(chat_types).forEach(([chat_name]) => {
            currentChat = chat_name;
        });
    }
    if (chat_types[currentChat]){
        $(".strain-input").css("color",chat_types[currentChat].colour);
    }
    if (currentChat){
        $(".strain-input").attr("placeholder","Current Chat: "+currentChat+". You can change this if you press left CTRL.");
    }
}

function showMessages(){
    $("#wrap-chat").show();
}
function hideMessages(){
    $("#wrap-chat").fadeOut(2000);
}

function clearChat(){
    $("#chat_table").html(``);
}

function hideUI(){
    $.post(`https://${GetParentResourceName()}/chatout`);
    $("#input_box").hide();
    $("#input_box").val("");
    $("#arrow").hide();
    $("#recommended-commands").hide();
    $("#recommended-commands").html(``);
    lastCommandIndex = saveLastCommandIndex;
    $.post(`https://${GetParentResourceName()}/hide`)
}