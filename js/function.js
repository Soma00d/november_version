$(document).ready(function(){
    
    var ws = new WebSocket("ws://localhost:8100");  
    var dictionary = {};  
    var jsonLog = [];
    //------//
    var lineContainer = $("#content_pretest .line_container");
    var testPoppin = $("#content_pretest .test_poppin");
    
    
    //remplissage des zones toolbox
    var zone0 = $("#content_toolbox .diag_inge .zone_0");
    var zone1 = $("#content_toolbox .diag_inge .zone_1");
    var zone2 = $("#content_toolbox .diag_inge .zone_2");
    var zone3 = $("#content_toolbox .diag_inge .zone_3 .content");
    
    var intervalSpe;
    
    var displayContainer = $("#content_toolbox .diag_inge .display_container .content");
    var buzzerContainer = $("#content_toolbox .diag_inge .buzzer_container .content");
    var safetyContainer = $("#content_toolbox .diag_inge .safety_container .content");
    var enableContainer = $("#content_toolbox .diag_inge .enable_container .content");
    var srtlContainer = $("#content_toolbox .diag_inge .srtl_container");
    
    var safetyFreqContainer = $("#content_toolbox .diag_inge .safety_container .safety_freq_val");
    var safetyVoltContainer = $("#content_toolbox .diag_inge .safety_container .safety_volt_val");    
    var enableFreqContainer = $("#content_toolbox .diag_inge .enable_container .enable_freq_val");
    var enableVoltContainer = $("#content_toolbox .diag_inge .enable_container .enable_volt_val");
    var supplyContainer = $("#content_toolbox .diag_inge .supply_container .content");
    var safetySRTL =  $("#content_toolbox .diag_inge .srtl_container .safety_srtl");
    var enableSRTL =  $("#content_toolbox .diag_inge .srtl_container .enable_srtl");
    
    //génération des joysticks
    var joystickContainerNew =  $(".joystick_container_new");
    
    
    var diagInge =  $("#content_toolbox .diag_inge");
    var diagIngeComponent =  $("#content_toolbox .diag_inge .diag_component");  
    
    //info génériques//    
    var userSSO = "";
    var partNumber = "";
    var serialNumber = "";
    var family_id;
    var familyName = "";
    var globalName = "";
    var familyChoice = "";
    var modelChoice = "";
    var typeChoice = "";
    var tstName = "";
    var sectionRepair ="";
    var joystickNumber;
    var nodeID;
    var cobID1;
    var cobID2;
    
    var startNodeMsg;
    var stopNodeMsg;
    
   //Definition des variables globales pour le test final    
    var nameFinalContainer = $("#testfinal_container .name_test_container");
    var symbolNameFinal = $("#testfinal_container #symbol_name_t");
    var descriptionFinal = $("#testfinal_container #description_t");
    var imgFinal = $("#testfinal_container .img_t img");
    var imgFinalBloc = $("#testfinal_container .img_t");
    var timerBloc = $("#testfinal_container .timer_bloc");
    var stopTestBloc = $("#testfinal_container .stop_test_bloc");
    var recapListFinal = $("#testfinal_container #recap_list_t .content_recap");
    var progressBarFinal = $("#testfinal_container #progress_bar_t .percent");
    var progressBarFinalInside = $("#testfinal_container #progress_bar_t .inside_bar");
        
    //Test final fonctionnel
    var finalTestEntries = {};     
    var waitingAction;
    var waitingPressValue;
    var waitingReleaseValue;
    var pressValueContinue;
    var releaseValueContinue;
    var validateTest = 0;
    var errorTestFinal = 0;
    
    var waitingValue;    
    var indexFinal;
    var maxIndexFinal;
    var intervalGlobal;    
    var currSymbol_name;
    var currType;
    var currDescription;
    var currPhoto_link;
    var currTimer;
    
    //Spybox
    var spyBox = $("#dialog-spybox .content_line");
    var spyBoxDialog = $("#dialog-spybox");
    var lastSpyMsg;
    var operatorID;
    var operatorData;
    
    var isFilter;
    var filterID;
    var filterData;
    
    //Calibration
    var calibrateBt1 = $(".calibrate_bt_1");
    var calibrateBt2 = $(".calibrate_bt_2");
    var calibrateBt3 = $(".calibrate_bt_3");
    var waitCalibResponse = "";
    var finalResponseData;
    
    var axisRawValueX1;
    var axisRawValueY1;
    var axisRawValueX2;
    var axisRawValueY2;
    var axisRawValueX3;
    var axisRawValueY3;
    
    var joystick1Val = $(".realtime_joysticks_val.joystick1");
    var joystick2Val = $(".realtime_joysticks_val.joystick2");
    var joystick3Val = $(".realtime_joysticks_val.joystick3");
    
    var joy1currX = $(".realtime_joysticks_val.joystick1 .x_value_joy");
    var joy1minX = $(".realtime_joysticks_val.joystick1 .minx_value_joy");
    var joy1maxX = $(".realtime_joysticks_val.joystick1 .maxx_value_joy");
    
    var joy1currY = $(".realtime_joysticks_val.joystick1 .y_value_joy");
    var joy1minY = $(".realtime_joysticks_val.joystick1 .miny_value_joy");
    var joy1maxY = $(".realtime_joysticks_val.joystick1 .maxy_value_joy");
    
    var indexVerifGlobal = 0;
    
    //get info version
    var bootRelease;
    var FPGARelease;
    var softwareRelease;
    var unicID;
    
    //download firmware
    var arrayOfLines;
    var waitDownloadResponse = "";
    var continueDownload = 0;
    var isDownloading = 0;
    var lineDownloading = 0;
    var downloadingBar = $(".download_tool .downloading_bar_container .downloading_bar");
    var downloadingBarContent = $(".download_tool .downloading_bar_container .downloading_bar_content");
    
    
    //-----------------------------------------------------//
    
    var _MODE = "START";
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// HOMEPAGE REPAIR  /////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //CONNEXION SECTION DIAGNOSTIQUE REPAIR
    $("#send_info_login_diag").on('click', function(){ 
        alert(addHexVal("00000580", nodeID));
        userSSO = ($(".login_diag #user_sso_input_diag").val());
        partNumber = ($(".login_diag #part_number_input_diag").val());
        serialNumber = ($(".login_diag #serial_number_input_diag").val()); 
        
        //definition des id
        cobID1 = addHexVal("00000580", nodeID);
        cobID2 = addHexVal("00000600", nodeID);        
        startNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000001"+nodeID+"000000000000";
        stopNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000002"+nodeID+"000000000000";
        
        if(userSSO !== "" && partNumber !== "" && serialNumber !== ""){
            $.ajax({
                url : 'php/api.php?function=get_tsui_repair&param1='+partNumber,
                type : 'GET',
                dataType : 'JSON',
                success: function(data, statut){
                    if(data.length == 0){
                        alert("No result found with this part number.")
                    }else{
                        familyName = data[0].name;
                        var photo = data[0].photo_link;
                        family_id = data[0].family;
                        tstName = data[0].tst_name;
                        sectionRepair = "DIAG";
                        globalName = data[0].family_name;
                        
                        $(".photo_tsui").attr('src', 'images/'+photo);
                        $(".title_bloc.name").html(familyName);                    
                        $(".sso_user").html(userSSO);
                        $(".part_number").html(partNumber);
                        $(".serial_number").html(serialNumber);                    
                        $("#content_home .information").removeClass("hidden");
                        $("#content_home .information_diag").removeClass("hidden");
                        $(".head_userinfo").removeClass("hidden");
                        $(".head_userinfo .info .role_user").html("Repair");
                        getInfoCard(globalName, cobID2);
                    }    
                    //Recupération du dictionnaire correspondant + remplissage du tableau diagnostique
                    $.ajax({
                        url : 'php/api.php?function=get_dictionaries_by_id&param1='+family_id,
                        type : 'GET',
                        dataType : 'JSON',
                        success: function(data, statut){
                            dictionary = data;                
                            var len = data.length;
                            lineContainer.empty();
                            for (var iter = 0; iter < len; iter++) {
                                if(data[iter].type !== "led" && data[iter].type !== "buzzer"){
                                    lineContainer.append("<div class='line id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td'>"+data[iter].symbol_name+"</span><span class='td'>"+data[iter].type+"</span><span class='td'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><span class='td totest'>Not tested</span></div>");
                                }else{
                                    lineContainer.append("<div class='line id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td'>"+data[iter].symbol_name+"</span><span class='td'>"+data[iter].type+"</span><span class='td'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><span class='td test_bt' data-name='"+data[iter].description+"' data-press='"+data[iter].pressed_val+"' data-release='"+data[iter].released_val+"' data-canid='"+data[iter].can_id+"'>TEST</span></div>");
                                }
                            }
                            //gestion des boutons de test des leds et buzzers
                            $(".test_bt").on('click',function(){    
                                var _this = $(this);
                                var description = $(this).data('name');
                                var press = $(this).data('press');
                                var release = $(this).data('release');
                                var canId = $(this).data('canid');        
                                var dlc = "0"+(press.toString().length/2)+"0000";
                                var signalStart = "002400806d68d7551407f09b861e3aad000549a844"+dlc+canId+press;
                                var signalStop = "002400806d68d7551407f09b861e3aad000549a844"+dlc+canId+release;

                                testPoppin.html("<div class='title'>"+description+"</div><div class='bt_test'><div class='bouton_grey start_bt'>Start</div><div class='bouton_grey stop_bt'>Stop</div></div><div class='result_test'>Did something happen as expected ?</div><div class='bt_test_result'><div class='bouton_grey yes_bt'>YES</div><div class='bouton_grey no_bt'>NO</div></div>");

                                testPoppin.find(".title").html(description);        
                                testPoppin.removeClass("hidden");

                                testPoppin.find(".start_bt").on('click', function(){                       
                                    sendSignal(signalStart);                                
                                });
                                testPoppin.find(".stop_bt").on('click', function(){                       
                                    sendSignal(signalStop);
                                });
                                testPoppin.find(".yes_bt").on('click', function(){  
                                    testPoppin.empty();
                                    testPoppin.addClass("hidden");
                                    _this.css('background-color','yellowgreen');
                                    _this.html('TEST OK');
                                    _this.parent().addClass("tested");
                                    _this.parent().addClass("testok");
                                });
                                testPoppin.find(".no_bt").on('click', function(){   
                                    testPoppin.empty();
                                    testPoppin.addClass("hidden");
                                    _this.css('background-color','red');
                                    _this.html('TEST FAIL');
                                    _this.parent().addClass("tested");
                                });
                            });

                            $(".totest").on('click',function(){
                               if($(this).hasClass("tested")){
                                   $(this).html("Not tested");
                                   $(this).removeClass("tested");
                                   $(this).parent().removeClass("tested");
                               }else{
                                   $(this).html("Tested");
                                   $(this).addClass("tested");
                                   $(this).parent().addClass("tested");
                               }
                            });
                        }
                    });     
                }
            });
        }else{
            alert("Some fields are missing");
        } 
        
    }); 
    
    
    
    //recupération des infos tsui homepage
    $("#send_info_hp").on('click', function(){
        userSSO = ($("#user_sso_input").val());
        partNumber = ($("#part_number_input").val());
        serialNumber = ($("#serial_number_input").val());  
        
        //definition des id
        cobID1 = addHexVal("00000580", nodeID);
        cobID2 = addHexVal("00000600", nodeID);        
        startNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000001"+nodeID+"000000000000";
        stopNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000002"+nodeID+"000000000000";
        
        if(userSSO !== "" && partNumber !== "" && serialNumber !== ""){
            $.ajax({
            url : 'php/api.php?function=get_tsui&param1='+partNumber,
            type : 'GET',
            dataType : 'JSON',
            success: function(data, statut){
                if(data.length == 0){
                    alert("No result found with this part number.")
                }else{
                    familyName = data[0].name;
                    var photo = data[0].photo_link;
                    sequences = data[0].linked_sequence;
                    family_id = data[0].family;
                    tstName = data[0].tst_name;
                    $(".photo_tsui").attr('src', 'images/'+photo);
                    $(".title_bloc.name").html(familyName);                    
                    $(".sso_user").html(userSSO);
                    $(".part_number").html(partNumber);
                    $(".serial_number").html(serialNumber);                    
                    $("#content_home .information").removeClass("hidden");
                    $(".head_userinfo").removeClass("hidden");
                    $(".head_userinfo .info .role_user").html("Repair");
                    getInfoCard(globalName, cobID2);
                }    
                //Recupération du dictionnaire correspondant + remplissage du tableau diagnostique
                $.ajax({
                    url : 'php/api.php?function=get_dictionaries_by_id&param1='+family_id,
                    type : 'GET',
                    dataType : 'JSON',
                    success: function(data, statut){
                        dictionary = data;                
                        var len = data.length;
                        lineContainer.empty();
                        for (var iter = 0; iter < len; iter++) {
                            if(data[iter].type !== "led" && data[iter].type !== "buzzer"){
                                lineContainer.append("<div class='line id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td'>"+data[iter].symbol_name+"</span><span class='td'>"+data[iter].type+"</span><span class='td'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><span class='td totest'>Not tested</span></div>");
                            }else{
                                lineContainer.append("<div class='line id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td'>"+data[iter].symbol_name+"</span><span class='td'>"+data[iter].type+"</span><span class='td'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><span class='td test_bt' data-name='"+data[iter].description+"' data-press='"+data[iter].pressed_val+"' data-release='"+data[iter].released_val+"' data-canid='"+data[iter].can_id+"'>TEST</span></div>");
                            }
                        }
                        //gestion des boutons de test des leds et buzzers
                        $(".test_bt").on('click',function(){    
                            var _this = $(this);
                            var description = $(this).data('name');
                            var press = $(this).data('press');
                            var release = $(this).data('release');
                            var canId = $(this).data('canid');        
                            var dlc = "0"+(press.toString().length/2)+"0000";
                            var signalStart = "002400806d68d7551407f09b861e3aad000549a844"+dlc+canId+press;
                            var signalStop = "002400806d68d7551407f09b861e3aad000549a844"+dlc+canId+release;
                            
                            testPoppin.html("<div class='title'>"+description+"</div><div class='bt_test'><div class='bouton_grey start_bt'>Start</div><div class='bouton_grey stop_bt'>Stop</div></div><div class='result_test'>Did something happen as expected ?</div><div class='bt_test_result'><div class='bouton_grey yes_bt'>YES</div><div class='bouton_grey no_bt'>NO</div></div>");
                            
                            testPoppin.find(".title").html(description);        
                            testPoppin.removeClass("hidden");

                            testPoppin.find(".start_bt").on('click', function(){                       
                                sendSignal(signalStart);                                
                            });
                            testPoppin.find(".stop_bt").on('click', function(){                       
                                sendSignal(signalStop);
                            });
                            testPoppin.find(".yes_bt").on('click', function(){  
                                testPoppin.empty();
                                testPoppin.addClass("hidden");
                                _this.css('background-color','yellowgreen');
                                _this.html('TEST OK');
                                _this.parent().addClass("tested");
                                _this.parent().addClass("testok");
                            });
                            testPoppin.find(".no_bt").on('click', function(){   
                                testPoppin.empty();
                                testPoppin.addClass("hidden");
                                _this.css('background-color','red');
                                _this.html('TEST FAIL');
                                _this.parent().addClass("tested");
                            });
                        });
                        
                        $(".totest").on('click',function(){
                           if($(this).hasClass("tested")){
                               $(this).html("Not tested");
                               $(this).removeClass("tested");
                               $(this).parent().removeClass("tested");
                           }else{
                               $(this).html("Tested");
                               $(this).addClass("tested");
                               $(this).parent().addClass("tested");
                           }
                        });
                    }
                });        
            }
         });
        }else{
            alert("Some fields are missing");
        }        
    }); 
    
    
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// HOMEPAGE ENGINEERING  ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //recupération des infos tsui homepage INGE
    $("#send_info_hp_E").on('click', function(){
        alert(addHexVal("00000580", nodeID));
        userSSO = ($("#user_sso_input_E").val());
        familyChoice = ($("#family_choice").html());
        modelChoice = ($("#model_choice").html());        
        typeChoice = ($("#type_choice").html()); 
        
        //definition des id
        cobID1 = addHexVal("00000580", nodeID);
        cobID2 = addHexVal("00000600", nodeID);        
        startNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000001"+nodeID+"000000000000";
        stopNodeMsg = "002400806d68d7551407f09b861e3aad000549a8440200000000000002"+nodeID+"000000000000";
        
        if(userSSO !== "" && familyChoice !== "" && modelChoice !== ""){            
            $.ajax({
            url : 'php/api.php?function=get_tsui&param1='+familyChoice+'&param2='+modelChoice+'&param3='+typeChoice,
            type : 'GET',
            dataType : 'JSON',
            success: function(data, statut){
                if(data.length == 0){
                    alert("No result found with this part number."+familyChoice)
                }else{
                    familyName = data[0].name;
                    var photo = data[0].photo_link;
                    family_id = data[0].family; 
                    joystickNumber = data[0].joystick_number;
                    globalName = data[0].family_name;
                    $(".photo_tsui").attr('src', 'images/'+photo);
                    if(typeChoice !="" && typeChoice !=" "){
                        $(".title_bloc.name").html(familyName + " - " + typeChoice);   
                    }else{
                        $(".title_bloc.name").html(familyName);  
                    }                
                                      
                    $(".sso_user").html(userSSO);
                    $(".part_number").html(partNumber);
                    $(".serial_number").html(serialNumber);                    
                    $("#content_homeE .information").removeClass("hidden");
                    $(".head_userinfo").removeClass("hidden");
                    $(".head_userinfo .info .role_user").html("Engineering");
                    getInfoCard(globalName, cobID2);
                }    
                //Recupération du dictionnaire correspondant + remplissage des zones toolbox
                $.ajax({
                    url : 'php/api.php?function=get_dictionaries_by_id&param1='+family_id,
                    type : 'GET',
                    dataType : 'JSON',
                    success: function(data, statut){
                        dictionary = data;                
                        var len = data.length;
                        for (var iter = 0; iter < len; iter++) {
                            console.log(data[iter].zone);
                            switch(data[iter].zone){                                
                                case "0":
                                    if(data[iter].is_led == "1"){
                                        zone0.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"' data-on='"+data[iter].on_signal+"' data-off='"+data[iter].off_signal+"' data-dim='"+data[iter].dim_signal+"' data-flash='"+data[iter].flash_signal+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                    }else if(data[iter].is_led == "2"){
                                        //
                                    }else{
                                        zone0.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='type'>"+data[iter].type+"</span><span class='descri'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span></div></div>");
                                    }
                                    break;
                                case "1":
                                   if(data[iter].is_led == "1"){
                                        zone1.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"' data-on='"+data[iter].on_signal+"' data-off='"+data[iter].off_signal+"' data-dim='"+data[iter].dim_signal+"' data-flash='"+data[iter].flash_signal+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                    }else{
                                        zone1.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='type'>"+data[iter].type+"</span><span class='descri'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span></div></div>");
                                    }
                                    break;
                                case "2":
                                    if(data[iter].is_led == "1"){
                                        zone2.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"' data-on='"+data[iter].on_signal+"' data-off='"+data[iter].off_signal+"' data-dim='"+data[iter].dim_signal+"' data-flash='"+data[iter].flash_signal+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                    }else if(data[iter].is_led == "2"){
                                        zone2.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"' data-on='"+data[iter].on_signal+"' data-off='"+data[iter].off_signal+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span><span class='switch special on'>O:<img src='images/switch_off.png'></span></div></div>");
                                    }else{
                                        zone2.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='type'>"+data[iter].type+"</span><span class='descri'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span></div></div>");
                                    }
                                    break;
                                case "3":
                                    if(data[iter].is_led == "1"){
                                        zone3.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"' data-on='"+data[iter].on_signal+"' data-off='"+data[iter].off_signal+"' data-dim='"+data[iter].dim_signal+"' data-flash='"+data[iter].flash_signal+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                    }else{
                                        zone3.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='type'>"+data[iter].type+"</span><span class='descri'>"+data[iter].description+"</span><span class='td press'>"+data[iter].pressed_val+"</span><span class='td rel'>"+data[iter].released_val+"</span></div></div>");
                                    }
                                    break;
                            }
                            switch(data[iter].type){
                                case "buzzer":
                                   buzzerContainer.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"' data-on='"+data[iter].on_signal+"' data-off='"+data[iter].off_signal+"'><div class='info_component'><span class='descri'>"+data[iter].description+"</span><span class='switch on'>O:<img src='images/switch_off.png'></span></div></div>");
                                   break;
                                case "display":
                                   displayContainer.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"' data-on='"+data[iter].on_signal+"' data-off='"+data[iter].off_signal+"' data-dim='"+data[iter].dim_signal+"' data-flash='"+data[iter].flash_signal+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span><span class='switch on'>O:<img src='images/switch_off.png'></span><span class='switch dim'>D:<img src='images/switch_off.png'></span><span class='switch flash'>F:<img src='images/switch_off.png'></span></div></div>");
                                   break;
                                case "joystick":
                                   joystickContainerNew.append("<div class='new_joystick' id='id"+data[iter].id+"'><div class='name'>"+data[iter].description+"</div><div class='area_visual'><div class='area_etalon'><img class='cursor' src='images/cross_red.png'></div></div><div class='values'>x : <span class='x_val'></span> y : <span class='y_val'></span></div></div>");
                                   break;
                            }
                            if(data[iter].is_safety =="1"){
                                safetyContainer.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span></div></div>");
                            }
                            if(data[iter].is_enable =="1"){
                                enableContainer.append("<div class='diag_component id"+data[iter].id+"' data-id='"+data[iter].id+"' data-name='"+data[iter].symbol_name+"' data-function='"+data[iter].type+"'><span class='td photo_piece'><img src='images/"+data[iter].photo_link+"'></span><div class='info_component'><span class='symbol'>"+data[iter].symbol_name+"</span><span class='descri'>"+data[iter].description+"</span></div></div>");
                            }
                                   
                        }
                        diagInge.find(".switch").on('click', function(){
                            var postSignal = "002400806d68d7551407f09b861e3aad000549a844080000";
                            var onSignal = $(this).parents(".diag_component").data("on");
                            var offSignal = $(this).parents(".diag_component").data("off");
                            var dimSignal = $(this).parents(".diag_component").data("dim");
                            var flashSignal = $(this).parents(".diag_component").data("flash"); 
                            
                            if($(this).hasClass("activated")){                                
                                diagInge.find(".switch img").attr('src', 'images/switch_off.png');
                                $(this).removeClass("activated");
                                sendSignal(postSignal+offSignal);
                                clearInterval(intervalSpe);
                            }else{
                                diagInge.find(".switch img").attr('src', 'images/switch_off.png');
                                $(this).find("img").attr('src', 'images/switch_on.png');
                                $(this).addClass("activated");
                                if($(this).hasClass('on')){
                                    sendSignal(postSignal+onSignal); 
                                    if($(this).hasClass('special')){
                                        intervalSpe = setInterval(function(){
                                            sendSignal(postSignal+onSignal);
                                            
                                        },500);                                     
                                    }
                                }else if($(this).hasClass('dim')){
                                    sendSignal(postSignal+dimSignal);
                                }else if($(this).hasClass('flash')){
                                    sendSignal(postSignal+flashSignal);
                                }
                            }
                        })
                    }
                });        
            }
         });
        }else{
            alert("Some fields are missing");
        }        
    }); 
    
    function getInfoCard(model, id){
        _MODE = "CALIBRATION";
        pingGetInfo(model, id);
        setTimeout(function(){
            var newBootRelease = bootRelease.substring(6,8)+"."+bootRelease.substring(4,6);
            $(".fpga_config").html(newBootRelease);
            var newFPGARelease = FPGARelease.substring(6,8)+FPGARelease.substring(4,6)+"."+FPGARelease.substring(2,4)+FPGARelease.substring(0,2);
            $(".boot_config").html(newFPGARelease);
            var newsoftwareRelease = softwareRelease.substring(6,8)+"."+softwareRelease.substring(4,6);
            $(".sw_config").html(newsoftwareRelease);
            var newunicID = unicID.substring(14,16)+"."+unicID.substring(12,14)+"."+unicID.substring(10,12)+"."+unicID.substring(8,10)+" "+unicID.substring(6,8)+"."+unicID.substring(4,6)+"."+unicID.substring(2,4)+"."+unicID.substring(0,2);
            $(".unic_config").html(newunicID);
            
            _MODE = "PRETEST";
        },1200);
    }
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// ON MESSAGE WEBSOCKET  ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   
   //Traitement des données websocket 
    ws.onmessage=function(event) {
        switch(_MODE){
            case "START":
                var message = JSON.parse(event.data); 
                if(message.type =="from_GW"){
                    var canId = message.canId;
                    var canData = message.canData; 
                    if(canData == "7f" || canData == "05" || canData == "00"){                        
                        nodeID = canId.substring(6,8);
                    }
                }                
                
                break;
            case "PRETEST":   
                var message = JSON.parse(event.data);        
                console.log(event.data);
                if(message.type =="from_GW"){
                    var canId = message.canId;
                    var canData = message.canData; 
                    for (var nb = 0; nb < dictionary.length; nb++) {
                        var trueCanID = addHexVal(dictionary[nb].can_id, nodeID);
                        if(trueCanID === canId){
                            switch(dictionary[nb].type){
                                case "button":                        
                                    if(dictionary[nb].pressed_val === canData){
                                        lineContainer.find(".line.id"+dictionary[nb].id).addClass("pressed");
                                        lineContainer.find(".line.id"+dictionary[nb].id).addClass("tested");                                       
                                        lineContainer.find(".line.id"+dictionary[nb].id+" .totest").addClass("tested");
                                        lineContainer.find(".line.id"+dictionary[nb].id+" .totest").html("Tested");
                                    }
                                    if(dictionary[nb].released_val === canData){
                                        lineContainer.find(".line.id"+dictionary[nb].id).addClass("released"); 
                                        lineContainer.find(".line.id"+dictionary[nb].id).addClass("tested");
                                        lineContainer.find(".line.id"+dictionary[nb].id+" .totest").addClass("tested");
                                        lineContainer.find(".line.id"+dictionary[nb].id+" .totest").html("Tested");
                                    }
                                    break;                                
                                case "joystick":           
                                    var part0 = canData.substring(0,2);
                                    var part1 = canData.substring(2,4);
                                    var part2 = canData.substring(4,6);
                                    var part3 = canData.substring(6,8);
                                    var part4 = canData.substring(8,10);
                                    var part5 = canData.substring(10,12);
                                    var part6 = canData.substring(12,14);
                                    var part7 = canData.substring(14,16);
                                    
                                    if(part0 != "00"){
                                        if(dictionary[nb].x_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part0)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part0)+'%');
                                            
                                        }
                                        if(dictionary[nb].y_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part0)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part0)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part1 != "00"){
                                        if(dictionary[nb].x_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part1)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part1)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part1)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part2 != "00"){
                                        if(dictionary[nb].x_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part2)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part2)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part2)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part2)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part3 != "00"){
                                        if(dictionary[nb].x_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part3)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part3)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part3)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part3)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part4 != "00"){
                                        if(dictionary[nb].x_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part4)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part4)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part4)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part4)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part5 != "00"){
                                        if(dictionary[nb].x_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part5)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part5)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part5)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part5)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part6 != "00"){
                                        if(dictionary[nb].x_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part6)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part6)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part6)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part6)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part7 != "00"){
                                        if(dictionary[nb].x_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part7)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part7)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part7)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values y_val').html(convertHexa(part7)+'%');
                                            
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }                                    
                                    break;
                                default:
                                    //console.log("non indentifié");
                            }
                        }
                    }
                }
                break;
            case "TESTFINAL":   
                var message = JSON.parse(event.data);        
                console.log(event.data);
                if(message.type =="from_GW"){
                    var canId = message.canId;
                    var canData = message.canData; 
                    if(waitingAction != ""){
                        switch(waitingAction){
                            case "BUTTON":
                                if(waitingPressValue == canData){
                                    pressValueContinue = 1;
                                }
                                if(waitingReleaseValue == canData){
                                    releaseValueContinue = 1;
                                }
                                if(pressValueContinue == 1 && releaseValueContinue == 1){
                                    validateTest = 1;
                                    waitingAction = "";
                                }
                                break;
                        }
                    }
                }
                break;
            case "CALIBRATION":                 
                var message = JSON.parse(event.data);        
                console.log(event.data);
                if(message.type =="from_GW"){
                    var canId = message.canId;
                    var canData = message.canData; 
                    if(waitCalibResponse !== ""){
                        var lengthData;                    
                        if(canId == waitCalibResponse){
                            console.log("response detected");
                            lengthData = canData.substring(0,2);
                            if(lengthData == "4f"){
                                finalResponseData = canData.substring(8,10);
                            }else if(lengthData == "4b"){
                                finalResponseData = canData.substring(8,12);
                            }else if(lengthData == "43"){
                                finalResponseData = canData.substring(8,16);
                            }else{
                                finalResponseData = canData.substring(8,14);
                            }
                            console.log(finalResponseData);
                            waitCalibResponse = "";
                        }
                    }
                    if(waitDownloadResponse !== ""){
                        //console.log("on detecte un waitresponse");
                        if(waitDownloadResponse == canId){
                            console.log("canid = waitresponse"+canId + " "+waitDownloadResponse)
                            if(canData.substring(0,2) == "20" || canData.substring(0,2) == "30"){
                                continueDownload = 1;                            
                                //console.log("on a foutu le continue download a 1")
                            }else if(canData.substring(0,2) == "80"){
                                continueDownload = 0;
                                waitDownloadResponse = "";
                            }
                        }
                    }
                }
                break;
            case "TOOLBOX": 
                var message = JSON.parse(event.data);  
                console.log(event.data);
                if(message.type =="from_pic"){
                    
                    var safetyFrequency = message.slf;
                    var safetyVoltage = message.slv;
                    var enableFrequency = message.enf;
                    var enableVoltage = message.env;
                    var srtl = message.srtl;
                    var globalVoltage = message.globv;
                    
                    safetyFrequency = convertHexaPic(safetyFrequency);
                    safetyVoltage = convertHexaPic(safetyVoltage)*0.138;
                    enableFrequency = convertHexaPic(enableFrequency);
                    enableVoltage = convertHexaPic(enableVoltage)*0.138;
                    globalVoltage = convertHexaPic(globalVoltage)*0.1375; 
                    
                    safetyFreqContainer.html(safetyFrequency);
                    safetyVoltContainer.html(safetyVoltage);
                    enableFreqContainer.html(enableFrequency);
                    enableVoltContainer.html(enableVoltage);
                    supplyContainer.html(globalVoltage.toFixed(2)+" V");
                    
                    safetySRTL.html(srtl.substring(0,1));
                    enableSRTL.html(srtl.substring(1,2));
                    
                    
                }else{
                    var canId = message.canId;
                    var canData = message.canData;
                    if(spyBoxDialog.hasClass("open") && !spyBoxDialog.hasClass("stop_mode")){
                        if(isFilter == 1){
                            if(operatorID == "==" && filterID !== "" && filterID == canId){
                                sendToSpy(canId, canData);
                            }
                            if(operatorID == "!=" && filterID !== "" && filterID != canId){
                                sendToSpy(canId, canData);
                            }

                            if(operatorData == "==" && filterData !== "" && filterData == canData){
                                sendToSpy(canId, canData);
                            }
                            if(operatorData == "!=" && filterData !== "" && filterData != canData){
                                sendToSpy(canId, canData);
                            }

                        }else{
                            sendToSpy(canId, canData);
                        }

                    }else{
                        console.log("not send to spy");
                    }
                    //on parcoure le dictionnaire a chaque message et on affiche l'action correspondate dans l'interface
                    for (var nb = 0; nb < dictionary.length; nb++) {
                        var trueCanID = addHexVal(dictionary[nb].can_id, nodeID);
                        if(trueCanID === canId){
                            switch(dictionary[nb].type){
                                case "button":                        
                                    if(dictionary[nb].pressed_val === canData){
                                        console.log("green");
                                        diagInge.find(".diag_component.id"+dictionary[nb].id).addClass("is_pressed"); 
                                    }
                                    if(dictionary[nb].released_val === canData){
                                        console.log("release");
                                        diagInge.find(".diag_component.id"+dictionary[nb].id).removeClass("is_pressed"); 
                                    }
                                    break;                            
                                case "joystick":           
                                     var part0 = canData.substring(0,2);
                                    var part1 = canData.substring(2,4);
                                    var part2 = canData.substring(4,6);
                                    var part3 = canData.substring(6,8);
                                    var part4 = canData.substring(8,10);
                                    var part5 = canData.substring(10,12);
                                    var part6 = canData.substring(12,14);
                                    var part7 = canData.substring(14,16);
                                    
                                    if(part0 != "00"){
                                        if(dictionary[nb].x_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part0)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part0)+'%');
                                            
                                        }
                                        if(dictionary[nb].y_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part0)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part0)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "0"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part1 != "00"){
                                        if(dictionary[nb].x_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part1)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part1)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part1)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "2"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part2 != "00"){
                                        if(dictionary[nb].x_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part2)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part2)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part2)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part2)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "4"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part3 != "00"){
                                        if(dictionary[nb].x_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part3)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part3)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part3)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part3)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "6"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part4 != "00"){
                                        if(dictionary[nb].x_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part4)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part4)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part4)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part4)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "8"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part5 != "00"){
                                        if(dictionary[nb].x_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part5)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part5)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part5)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part5)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "10"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part6 != "00"){
                                        if(dictionary[nb].x_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part6)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part6)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part6)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html(convertHexa(part6)+'%');
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "12"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }
                                    if(part7 != "00"){
                                        if(dictionary[nb].x_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':convertHexa(part7)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html(convertHexa(part7)+'%');
                                        }
                                        if(dictionary[nb].y_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':(convertHexa(part7)*-1)+'%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values y_val').html(convertHexa(part7)+'%');
                                            
                                        }
                                    }else{
                                        if(dictionary[nb].x_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'left':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .x_val').html('0%');
                                        }
                                        if(dictionary[nb].y_pos == "14"){
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .cursor').css({'top':'0%'});
                                            joystickContainerNew.find('#id'+dictionary[nb].id+' .values .y_val').html('0%');
                                        }
                                    }                                   

                                    break;
                                default:
                                    //console.log("non indentifié");
                            }
                        }
                    }
                }

                break;
        }         
        
    };
    
      
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// SPY BOX        ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    
    function sendToSpy(canId, canData){
        var d = spyBox.get(0);
        d.scrollTop = d.scrollHeight;
        if(lastSpyMsg !== canData ){
            spyBox.append("<div class='line_spy'><span class='can_id_spy' data-id='"+canId+"'>"+canId+"</span> <span class='can_data_spy'>"+canData+"</span> <span class='nb'>1</span><span class='ts'>"+new Date().getTime()+"</span></div>");
        }else{  
            if ($('#dialog-spybox .content_line').is(':empty')){
                spyBox.append("<div class='line_spy'><span class='can_id_spy' data-id='"+canId+"'>"+canId+"</span> <span class='can_data_spy'>"+canData+"</span> <span class='nb'>1</span><span class='ts'>"+new Date().getTime()+"</span></div>");
            }else{
                var nb = $("#dialog-spybox .content_line .line_spy:last-child .nb").html();
                nb = parseInt(nb);
                nb ++;
                $(".content_line .line_spy:last-child .nb").html(nb);
            }
            
        }               
        lastSpyMsg = canData;
    };
    
    $("#dialog-spybox .spy_stop").on('click',function(){        
        spyBoxDialog.addClass("stop_mode");
    });
    $("#dialog-spybox .spy_play").on('click',function(){
        spyBoxDialog.removeClass("stop_mode");
    });
    $("#dialog-spybox .spy_clear").on('click',function(){
        spyBox.empty();
    });
   
    $("#dialog-spybox .is_different_canid").on('click',function(){
        if($(this).hasClass("activated")){
            $(this).removeClass("activated");
        }else{
            $(this).addClass("activated");
        }
    });
    $("#dialog-spybox .is_different_candata").on('click',function(){
        if($(this).hasClass("activated")){
            $(this).removeClass("activated");
        }else{
            $(this).addClass("activated");
        }
    });    
    $("#dialog-spybox .launch_filter").on('click',function(){
       var inputCanid =  $(".filter_canid").val();
       var inputCandata =  $(".filter_candata").val();
       operatorID = "==";
       operatorData = "==";
       
       if($(".is_different_canid").hasClass('activated')){
           operatorID = "!=";
       }
       if($(".is_different_candata").hasClass('activated')){
           operatorData = "!=";
       }
       if(inputCanid == "" && inputCandata == ""){
           $("#dialog-spybox .recap_filter").html("No filters applied");
           isFilter = 0;
       }else{           
           if(inputCandata !== "" && inputCanid !== ""){
               $("#dialog-spybox .recap_filter").html("CAN ID "+operatorID+" "+inputCanid+" && CAN DATA "+operatorData+" "+inputCandata+".");
               filterID = inputCanid;
               filterData = inputCandata;
           }
           if(inputCandata !== "" && inputCanid == ""){
               $("#dialog-spybox .recap_filter").html("CAN DATA "+operatorData+" "+inputCandata+".");
               filterID = "";
               filterData = inputCandata;
           }
           if(inputCandata == "" && inputCanid !== ""){
               $("#dialog-spybox .recap_filter").html("CAN ID "+operatorID+" "+inputCanid+".");
               filterID = inputCanid;
               filterData = "";
           }
           isFilter = 1;
       }
      
    });
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// SENDER BOX        ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    
    $("#dialog-sender .sender_test").on('click',function(){        
        getPreviewValues();
    });
    
    $("#dialog-sender .add_zero").on('click',function(){        
        adjustCanMessage();
    });
    
    function addZeroBefore(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    function addZeroAfter(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : n + new Array(width - n.length + 1).join(z);
    }
    
    function adjustCanMessage(){
        var dlcInputSender = $("#dialog-sender .candlc_sender").val().trim();
        var idInputSender = $("#dialog-sender .canid_sender").val().trim();
        var dataInputSender = $("#dialog-sender .candata_sender").val().trim();
        
        dlcInputSender = addZeroBefore(dlcInputSender, 2);
        idInputSender = addZeroBefore(idInputSender, 8);
        dataInputSender = addZeroAfter(dataInputSender, 16);
        
        $("#dialog-sender .candlc_sender").val(dlcInputSender);
        $("#dialog-sender .canid_sender").val(idInputSender);
        $("#dialog-sender .candata_sender").val(dataInputSender);
    }
    
    function getPreviewValues(){
        var dlcInputSender = $("#dialog-sender .candlc_sender").val().trim();
        var idInputSender = $("#dialog-sender .canid_sender").val().trim();
        var dataInputSender = $("#dialog-sender .candata_sender").val().trim();
        
        if(dlcInputSender.length == 0 && idInputSender.length == 0 && dataInputSender.length == 0 ){
            $("#dialog-sender .error_sender").html("Fields are empty.");
            $("#dialog-sender .error_sender").removeClass("hidden");
            $("#dialog-sender .result_sender").addClass("hidden");
        }else{
            $("#dialog-sender .error_sender").addClass("hidden");            
            displayPreviewValues(dlcInputSender, idInputSender, dataInputSender);
        }
    }
    
    function displayPreviewValues(dlcInputSender, idInputSender, dataInputSender){
        $("#dialog-sender .result_sender").removeClass("hidden");
        $("#dialog-sender .result_sender .sender_msg").html("<span class='text_ref'>Message : </span><span class='red'>"+dlcInputSender+"</span> <span class='green'>"+idInputSender+"</span> <span class='blue'>"+dataInputSender+"</span>");
        $("#dialog-sender .result_sender .length_msg").html("<span class='text_ref'>Length : </span><span class='red'>"+dlcInputSender.length+"/2</span> <span class='green'>"+idInputSender.length+"/8</span> <span class='blue'>"+dataInputSender.length+"/16</span>");
    }
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// DIAG PRINT LOG ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    
    //Generation du tableau de log qui sera ensuite save en base de donnée
    function generateJsonLog(){
        jsonLog = [];
        var name;
        var fct;
        var completeName;
        $("#content_pretest .line_container .line").each(function(){
            if($(this).hasClass("tested")){
                name = $(this).data('name');
                fct = $(this).data('function');
                if(fct == "button"){
                    if($(this).hasClass("pressed")){
                        completeName = name+" - press"; 
                        jsonLog.push({name:completeName, test:'OK', fct:fct});
                    }else{
                        completeName = name+" - press"; 
                        jsonLog.push({name:completeName, test:'FAILED', fct:fct});
                    }
                    if($(this).hasClass("released")){
                        completeName = name+" - release"; 
                        jsonLog.push({name:completeName, test:'OK', fct:fct});
                    }else{
                        completeName = name+" - release"; 
                        jsonLog.push({name:completeName, test:'FAILED', fct:fct});
                    }                     
                }else{
                    if($(this).hasClass("testok")){
                        completeName = name+" - "+fct; 
                        jsonLog.push({name:completeName, test:'OK', fct:fct});
                    }else{
                        completeName = name+" - "+fct; 
                        jsonLog.push({name:completeName, test:'FAILED', fct:fct});
                    }
                }                 
            }else{
                name = $(this).data('name');
                fct = $(this).data('function');
                if(fct == "button"){
                    completeName = name+" - press"; 
                    jsonLog.push({name:completeName, test:'untested', fct:fct});
                    completeName = name+" - release"; 
                    jsonLog.push({name:completeName, test:'untested',fct:fct});
                }else{
                    completeName = name+" - "+fct; 
                    jsonLog.push({name:completeName, test:'untested',fct:fct});
                }                                
            }
        });
        console.log(jsonLog);
        console.log("------");
        jsonLog = JSON.stringify(jsonLog);
        console.log(jsonLog);
        $.ajax({
            type: "POST",
            url: "php/api.php?function=save_log_pretest",
            data: {jsonlog:jsonLog},
            success: function (msg) {
                alert("Your log has been saved.");
                $("#print_log").removeClass("hidden");
            }
        });
    };
    
    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printJsonLog(jsonLog){  
        var msg = JSON.parse(jsonLog);
        var lineButton = "";
        var lineLed = "";
        var lineJoystick = "";
        var lineBuzzer = "";
        for(var i =0; i<msg.length; i++){
            if(msg[i].fct == "button"){
                if(msg[i].test == "untested"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:orange'>"+msg[i].test+"</span></div>"                
                }
                if(msg[i].test == "OK"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:green'>"+msg[i].test+"</span></div>"                
                }
                if(msg[i].test == "FAILED"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:red'>"+msg[i].test+"</span></div>"                
                }
                
                lineButton += line;
            }
            if(msg[i].fct == "led"){
                if(msg[i].test == "untested"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:orange'>"+msg[i].test+"</span></div>"                
                }
                if(msg[i].test == "OK"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:green'>"+msg[i].test+"</span></div>"                
                }
                if(msg[i].test == "FAILED"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:red'>"+msg[i].test+"</span></div>"                
                }
                lineLed += line;
            }
            if(msg[i].fct == "buzzer"){
                if(msg[i].test == "untested"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:orange'>"+msg[i].test+"</span></div>"                
                }
                if(msg[i].test == "OK"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:green'>"+msg[i].test+"</span></div>"                
                }
                if(msg[i].test == "FAILED"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:red'>"+msg[i].test+"</span></div>"                
                }
                lineBuzzer += line;
            }
            if(msg[i].fct == "joystick"){
                if(msg[i].test == "untested"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> = <span style='color:orange'>"+msg[i].test+"</span></div>"                
                }
                lineJoystick += line;
            }
            
        }
        var currentdate = new Date(); 
        var datetime =  currentdate.getDate() + "/"+ (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " "+ currentdate.getHours() + "h" + currentdate.getMinutes();
        var myWindow=window.open('','','width=1000,height=800');
        myWindow.document.write("<h2>PRETEST LOG RECORD - "+datetime+"</h2><div style='border:1px solid black;padding:5px;'><b>Family</b> : "+familyName+" - <b>PN</b> : "+partNumber+" - <b>SN</b> : "+serialNumber+" - <b>Firmware version</b> : 2.0.3 - <b>User SSO</b> : "+userSSO+"</div><h3>BUTTONS</h3><div>"+lineButton+"</div><h3>BUZZERS</h3><div>"+lineBuzzer+"</div><h3>BACKLIGHTS</h3><div>"+lineLed+"</div>");
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    };
    
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// FINAL   TEST /////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    
     //Click on launch final test button
    $(".launch_final").on('click', function(){        
        launchFinalTest();
        $(".instructions_testfinal").addClass("hidden");
        sendSignal("002400806d68d7551407f09b861e3aad000549a84402000000000000012D000000000000");
    });
    
    //valider manuellement l'étape (dev only)
    $("#next_final_test").on('click', function(){
        nextStepFinal("ok");
    });
    
    //interrompre manuellement le test final
    $("#stop_final_test").on('click', function(){
        stopFinalTest("interrupted");
    });
    
    //enregistrement et impression des logs
    $(".print_log_final").on('click', function(){
        generateJsonLogFinal();
    });
    
    //impression du TST
    $(".print_tst").on('click', function(){
        if(errorTestFinal == 0){
            var url = "testbench/files/tst/"+tstName;
            window.open(url);
        }else{
            alert("You can't print TST while you get errors in final test");
        }
        
    });
    
    //recuperation des entrées du test final dans le dictionnaire associé
    function getFinalTest(){
        $.ajax({
                url : 'php/api.php?function=get_final_test&param1='+family_id,
                type : 'GET',
                dataType : 'JSON',
                success: function(data, statut){
                    finalTestEntries = data;
                    
                }
            }
        );
    };
    
    //Launch final test
    function launchFinalTest(){
        indexFinal = 0;
        errorTestFinal = 0;
        _MODE = "TESTFINAL";
        getFinalTest();
        
        setTimeout(function(){
            maxIndexFinal = finalTestEntries.length;
            if(maxIndexFinal > 0){
                $("#testfinal_container .display_test_content").removeClass("hidden");
                $("#testfinal_container #launch_final_test").addClass("hidden");
                nameFinalContainer.removeClass("hidden");
                timerBloc.removeClass("hidden");
                imgFinalBloc.removeClass("hidden");
                stopTestBloc.addClass("hidden");
                $("#stop_final_test").removeClass("hidden");
                $("#next_final_test").removeClass("hidden");
                recapListFinal.empty();
                timerBloc.html("");
                
                displayFinalTest(indexFinal);
            }            
        },200);
    }
    
    //Affichage du test final en cours
    function displayFinalTest(indexFinal){        
        var pourcentage = Math.round((indexFinal/maxIndexFinal)*100);
        
        currSymbol_name = finalTestEntries[indexFinal].symbol_name;
        currType = finalTestEntries[indexFinal].type;
        currDescription = finalTestEntries[indexFinal].description;
        currPhoto_link = finalTestEntries[indexFinal].photo_link;
        currTimer = finalTestEntries[indexFinal].timer;
        
        launchTimer(currTimer);
        
        var value = finalTestEntries[indexFinal].value;
        var can_id = addHexVal(finalTestEntries[indexFinal].can_id, nodeID);
        var pressed_val = finalTestEntries[indexFinal].pressed_val;
        var released_val = finalTestEntries[indexFinal].released_val;
        
        switch(currType){
            case "button":
                symbolNameFinal.html("Press and release "+currSymbol_name);
                descriptionFinal.html(currDescription);
                imgFinal.attr('src', 'images/'+currPhoto_link);
                progressBarFinalInside.css('width',pourcentage+'%');
                progressBarFinal.html(pourcentage+'%');
                waitingAction = "BUTTON";
                waitingPressValue = pressed_val;
                waitingReleaseValue = released_val;
                console.log("waiting action :"+waitingAction+" // "+pressed_val + " / "+released_val);
                break;
            case "joystick":
                break;
        }
        
    };
    
    //goto Next step with result in param
    function nextStepFinal(result){
        indexFinal++;
        timerBloc.html("");
        clearInterval(intervalGlobal);
        if(result == "ok"){
            var line = "<div class='line'><span class='symbol'>"+currSymbol_name+"</span> - <span class='description'>"+currDescription+"</span><span class='type'>"+currType+"</span><span class='result green'>TEST OK</span></div>";
        }else{
            var line = "<div class='line'><span class='symbol'>"+currSymbol_name+"</span> - <span class='description'>"+currDescription+"</span><span class='type'>"+currType+"</span><span class='result red'>TEST FAIL</span></div>";
            errorTestFinal ++;
        }
        recapListFinal.append(line);
        var d = recapListFinal.get(0);
        d.scrollTop = d.scrollHeight;
        if(indexFinal< maxIndexFinal){
            displayFinalTest(indexFinal);
        }else{
            stopFinalTest("end");
        }
    }
    
    //Gestion du timer
    function launchTimer(timer){
        var time = timer*1000;
        intervalGlobal = setInterval(function(){ 
            if(timer == 0){
                nextStepFinal("fail");                
            }else{
                if(validateTest == 1){
                    pressValueContinue = 0;
                    releaseValueContinue = 0;
                    validateTest = 0;
                    waitingAction = "";
                    nextStepFinal("ok");
                }
                timerBloc.html(timer);
                timer -= 1;
            }            
        }, 1000);
    };
    
    //Interrupt or end Final test
    function stopFinalTest(result){
        switch(result){
            case "interrupted":
                $(".stop_test_bloc .result_title").html("Final test has been interrupted");
                clearInterval(intervalGlobal);
                break;
            case "end":
                var pourcentage = 100;
                progressBarFinalInside.css('width',pourcentage+'%');
                progressBarFinal.html(pourcentage+'%');
                if(errorTestFinal>0){
                    $(".stop_test_bloc .result_title").html("Final test is completed with "+errorTestFinal+" error(s)");                    
                }else{
                    $(".stop_test_bloc .result_title").html("Final test is completed succesfully");
                    $(".print_tst").removeClass("hidden");
                }                
                break;
        }        
        nameFinalContainer.addClass("hidden");
        timerBloc.addClass("hidden");
        imgFinalBloc.addClass("hidden");
        stopTestBloc.removeClass("hidden");
        $("#stop_final_test").addClass("hidden");
        $("#next_final_test").addClass("hidden");
        
        _MODE = "PRETEST";
    }
    
    function generateJsonLogFinal(){
        var jsonLogFinal = [];
        var name;
        var description;
        var result;
        var type;
        $("#recap_list_t .content_recap .line").each(function(){            
            name = $(this).find('.symbol').html();
            description = $(this).find('.description').html();
            type = $(this).find('.type').html();
            result = $(this).find('.result').html();

            jsonLogFinal.push({name:name, description:description, type:type, result:result });            
        });
        console.log(jsonLogFinal);
        console.log("------");
        jsonLogFinal = JSON.stringify(jsonLogFinal);
        console.log(jsonLogFinal);
        $.ajax({
            type: "POST",
            url: "php/api.php?function=save_log_final",
            data: {jsonlog:jsonLogFinal},
            success: function (msg) {
                alert("Your log has been saved.");
                printJsonLogFinal(jsonLogFinal);
            }
        });
    };
    
    //Generation du rapport de test et affichage de la fenetre d'impression 
    function printJsonLogFinal(jsonLog){  
        var msg = JSON.parse(jsonLog);
        var lineButton = "";
        var lineLed = "";
        var lineJoystick = "";
        var lineBuzzer = "";
        for(var i =0; i<msg.length; i++){
            if(msg[i].type == "button"){
                if(msg[i].result == "TEST OK"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:green'>"+msg[i].result+"</span></div>"                
                }
                if(msg[i].result == "TEST FAIL"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:red'>"+msg[i].result+"</span></div>"                
                }
                
                lineButton += line;
            }
            if(msg[i].type == "led"){
                 if(msg[i].result == "TEST OK"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:green'>"+msg[i].result+"</span></div>"                
                }
                if(msg[i].result == "TEST FAIL"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:red'>"+msg[i].result+"</span></div>"                
                }
                
                lineLed += line;
            }
            if(msg[i].type == "buzzer"){
                if(msg[i].result == "TEST OK"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:green'>"+msg[i].result+"</span></div>"                
                }
                if(msg[i].result == "TEST FAIL"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:red'>"+msg[i].result+"</span></div>"                
                }
                
                lineBuzzer += line;
            }
            if(msg[i].type == "joystick"){
                if(msg[i].result == "TEST OK"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:green'>"+msg[i].result+"</span></div>"                
                }
                if(msg[i].result == "TEST FAIL"){
                    var line = "<div><span style='width:100px;display:inline-block;'>"+msg[i].name+"</span> ("+msg[i].description+") = <span style='color:red'>"+msg[i].result+"</span></div>"                
                }
                
                lineJoystick += line;
            }
            
        }
        var currentdate = new Date(); 
        var datetime =  currentdate.getDate() + "/"+ (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " "+ currentdate.getHours() + "h" + currentdate.getMinutes();
        var myWindow=window.open('','','width=1000,height=800');
        myWindow.document.write("<h2>FINAL TEST LOG RECORD - "+datetime+"</h2><div style='border:1px solid black;padding:5px;'><b>Family</b> : "+familyName+" - <b>PN</b> : "+partNumber+" - <b>SN</b> : "+serialNumber+" - <b>Firmware version</b> : 2.0.3 - <b>User SSO</b> : "+userSSO+"</div><h3>BUTTONS</h3><div>"+lineButton+"</div><h3>BUZZERS</h3><div>"+lineBuzzer+"</div><h3>BACKLIGHTS</h3><div>"+lineLed+"</div>");
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    };
    
    
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// CALIBRATION //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var joystickLongSubindex;
    var joystickLatSubindex;
    
    calibrateBt1.find("button").on('click', function(){
        _MODE = "CALIBRATION";
        joystickLongSubindex = "01";
        joystickLatSubindex = "02";
        calibrateBt1.find(".calibrate_tool").removeClass("hidden");
        calibrateZeroLong("1");
        $(this).addClass("hidden");
    });    
    calibrateBt2.find("button").on('click', function(){
        _MODE = "CALIBRATION";
        joystickLongSubindex = "03";
        joystickLatSubindex = "04";
        calibrateBt2.find(".calibrate_tool").removeClass("hidden");
        calibrateZeroLong("2");
        $(this).addClass("hidden");
    });    
    calibrateBt3.find("button").on('click', function(){
        _MODE = "CALIBRATION";
        joystickLongSubindex = "05";
        joystickLatSubindex = "06";
        calibrateBt3.find(".calibrate_tool").removeClass("hidden");
        calibrateZeroLong("3");
        $(this).addClass("hidden");
    });  
    
    $(".verify_calibration").on('click', function(){
        _MODE = "CALIBRATION";
        if($(this).hasClass("joystick1")){
            console.log("on lance la verif joystick1 !!!");
            var indexVerif = 0;
            var intervalVerify = setInterval(function(){
                verifyCalibration("joystick1");
                indexVerif++;
                indexVerifGlobal++;
                if(indexVerif > 30){                    
                    clearInterval(intervalVerify);
                    indexVerif = 0;
                    console.log("stop interval");
                }
            },300);
        }
        if($(this).hasClass("joystick2")){
            var indexVerif2 = 0;
            var intervalVerify = setInterval(function(){
                verifyCalibration("joystick2");
                indexVerif2++;
                if(indexVerif2 > 30){
                    clearInterval(intervalVerify);
                    console.log("stop interval");
                }
            },500);
        }
        if($(this).hasClass("joystick3")){
            var indexVerif3 = 0;
            var intervalVerify = setInterval(function(){
                verifyCalibration("joystick3");
                indexVerif3++;
                if(indexVerif3 > 30){
                    clearInterval(intervalVerify);
                    console.log("stop interval");
                }
            },600);
        }
        
    });    
    
    $(".reset_calibration_verif").on('click', function(){
        _MODE = "CALIBRATION";
        if($(this).hasClass("joystick1")){
            resetCalibrationVerif("joystick1");
        }
        if($(this).hasClass("joystick2")){
            resetCalibrationVerif("joystick2");
        }
        if($(this).hasClass("joystick3")){
            resetCalibrationVerif("joystick3");
        }
        
    });    
    
    var Cal_merde = "002400806d68d7551407f09b861e3aad000549a844";
    var Cal_dlc = "080000";
    var Cal_data   = "401f540200000000";
    var Cal_data_pre = "401f54";
    var Cal_completion = "00000000";
    
    var Cal_dataX1 = "401f540100000000";
    var Cal_dataY1 = "401f540200000000";
    var Cal_dataX2 = "401f540300000000";
    var Cal_dataY2 = "401f540400000000";
    var Cal_dataX3 = "401f540500000000";
    var Cal_dataY3 = "401f540600000000";
    
    var Cal_dataX1Final = "4001650100000000";
    var Cal_dataY1Final = "4001650200000000";
    var Cal_dataX2Final = "4001650300000000";
    var Cal_dataY2Final = "4001650400000000";
    var Cal_dataX3Final = "4001650500000000";
    var Cal_dataY3Final = "4001650600000000";
    
     $(".eprom_protect .bt_eprom").on('click', function(){
        if($(".eprom_protect").hasClass("protected")){
            $(".img_eprom").attr('src', "images/unprotected.png");
            $(this).html("LOCK EEPROM");
            $(this).css({"background":"#3b73b9", "color": "white"});
            $(".txt_eprom").html("EEPROM is writable");
            sendSignal(Cal_merde+Cal_dlc+cobID2+"2f00550100000000");
            $(".eprom_protect").removeClass("protected");
        }else{
            $(".img_eprom").attr('src', "images/protected.png");
            $(this).html("UNLOCK EEPROM");
            $(this).css({"background":"#c4c4c4","color":"black"});
            $(".txt_eprom").html("EEPROM is protected");
            sendSignal(Cal_merde+Cal_dlc+cobID2+"2f00550101000000");
            $(".eprom_protect").addClass("protected");
        }
    });
    
    var axisRawSignal = Cal_merde+Cal_dlc+cobID2+Cal_data;
    
    var axisRawSignalX = Cal_merde+Cal_dlc+cobID2+Cal_data_pre+joystickLongSubindex+Cal_completion;
    var axisRawSignalY = Cal_merde+Cal_dlc+cobID2+Cal_data_pre+joystickLatSubindex+Cal_completion;
    
    var axisRawSignalX1 = Cal_merde+Cal_dlc+cobID2+Cal_dataX1;
    var axisRawSignalY1 = Cal_merde+Cal_dlc+cobID2+Cal_dataY1;
    var axisRawSignalX2 = Cal_merde+Cal_dlc+cobID2+Cal_dataX2;
    var axisRawSignalY2 = Cal_merde+Cal_dlc+cobID2+Cal_dataY2;
    var axisRawSignalX3 = Cal_merde+Cal_dlc+cobID2+Cal_dataX3;
    var axisRawSignalY3 = Cal_merde+Cal_dlc+cobID2+Cal_dataY3;
    
    var axisRawSignalX1Final = Cal_merde+Cal_dlc+cobID2+Cal_dataX1Final;
    var axisRawSignalY1Final = Cal_merde+Cal_dlc+cobID2+Cal_dataY1Final;
    var axisRawSignalX2Final = Cal_merde+Cal_dlc+cobID2+Cal_dataX2Final;
    var axisRawSignalY2Final = Cal_merde+Cal_dlc+cobID2+Cal_dataY2Final;
    var axisRawSignalX3Final = Cal_merde+Cal_dlc+cobID2+Cal_dataX3Final;
    var axisRawSignalY3Final = Cal_merde+Cal_dlc+cobID2+Cal_dataY3Final;
    
    var axisRawZeroLong;
    var axisRawZeroLat;
    var axisRawMaxLong;
    var axisRawMinLong;
    var axisRawMaxLat;
    var axisRawMinLat;
    
    function signalComposer(response, header, subIndex){
        var newSignal;
        if(response.length == 2){
            newSignal = Cal_merde+Cal_dlc+cobID2+"2f"+header+subIndex+response+"000000";
            console.log("nouveau signal envoyé : "+newSignal);  
        }else if(response.length == 4){
            newSignal = Cal_merde+Cal_dlc+cobID2+"2b"+header+subIndex+response+"0000";      
            console.log("nouveau signal envoyé : "+newSignal);  
        }else if(response.length == 8){
            newSignal = Cal_merde+Cal_dlc+cobID2+"23"+header+subIndex+response;
            console.log("nouveau signal envoyé : "+newSignal);  
        }else{
            console.log("nouveau signal envoyé : "+newSignal);  
        }
        return newSignal;
    }
    
    //Recuperation de la position Longitudinale et stockage dans l'EPROM
    function calibrateZeroLong(identifier){
        console.log(axisRawSignalX+" // "+axisRawSignalY);
        $(".calibrate_bt_"+identifier).find(".status_calib").html("Set ZERO position");
        $(".calibrate_bt_"+identifier).find(".action_calib").html("<img src='images/zero_arrow.png'>");
        $(".calibrate_bt_"+identifier).find(".validate_calib").on('click', function(){
            //alert("length = "+axisRawSignal.length+" ..send signal acquisition ZERO : "+axisRawSignal);
            if(identifier == "1"){
                sendSignal(axisRawSignalX1);
            }
            if(identifier == "2"){
                sendSignal(axisRawSignalX2);
            }
            if(identifier == "3"){
                sendSignal(axisRawSignalX3);
            }
            
            waitCalibResponse = cobID1;
            
            setTimeout(function(){
                axisRawZeroLong = finalResponseData;
                var newSignal = signalComposer(axisRawZeroLong, "2054", joystickLongSubindex); //param = response + header for zero long                
                sendSignal(newSignal);
                calibrateMaxLong(identifier);
            },200);
        });
    }
    function calibrateMaxLong(identifier){
        $(".calibrate_bt_"+identifier).find(".validate_calib").off();
        $(".calibrate_bt_"+identifier).find(".status_calib").html("Set RIGHT position max");
        $(".calibrate_bt_"+identifier).find(".action_calib").html("<img src='images/right_arrow.png'>");
        $(".calibrate_bt_"+identifier).find(".validate_calib").on('click', function(){
            //alert("length = "+axisRawSignal.length+" ..send signal acquisition axis raw MAX : "+axisRawSignal);  
            if(identifier == "1"){
                sendSignal(axisRawSignalX1);
            }
            if(identifier == "2"){
                sendSignal(axisRawSignalX2);
            }
            if(identifier == "3"){
                sendSignal(axisRawSignalX3);
            }
            waitCalibResponse = cobID1;
            setTimeout(function(){
                axisRawMaxLong = finalResponseData;
                var newSignal = signalComposer(axisRawMaxLong, "2254", joystickLongSubindex); //param = response + header for max long
                sendSignal(newSignal);
                calibrateMinLong(identifier);
            },200);
        });
    }
    function calibrateMinLong(identifier){
        $(".calibrate_bt_"+identifier).find(".validate_calib").off();
        $(".calibrate_bt_"+identifier).find(".status_calib").html("Set LEFT position max");
        $(".calibrate_bt_"+identifier).find(".action_calib").html("<img src='images/left_arrow.png'>");
        $(".calibrate_bt_"+identifier).find(".validate_calib").on('click', function(){
            //alert("length = "+axisRawSignal.length+" ..send signal acquisition axis raw MIN : "+axisRawSignal);  
            if(identifier == "1"){
                sendSignal(axisRawSignalX1);
            }
            if(identifier == "2"){
                sendSignal(axisRawSignalX2);
            }
            if(identifier == "3"){
                sendSignal(axisRawSignalX3);
            }
            waitCalibResponse = cobID1;
            setTimeout(function(){
                axisRawMinLong = finalResponseData;
                var newSignal = signalComposer(axisRawMinLong, "2154", joystickLongSubindex); //param = response + header for min long
                sendSignal(newSignal);
                calibrateMinLat(identifier);
            },200);
        });
    }
    
    //Recuperation de la position Verticale et stockage dans l'EPROM
    function calibrateMinLat(identifier){
        $(".calibrate_bt_"+identifier).find(".validate_calib").off();
        $(".calibrate_bt_"+identifier).find(".status_calib").html("Set BOTTOM position max");
        $(".calibrate_bt_"+identifier).find(".action_calib").html("<img src='images/down_arrow.png'>");
        $(".calibrate_bt_"+identifier).find(".validate_calib").on('click', function(){
            //alert("length = "+axisRawSignal.length+" ..send signal acquisition axis raw MIN : "+axisRawSignal);  
            if(identifier == "1"){
                sendSignal(axisRawSignalY1);
            }
            if(identifier == "2"){
                sendSignal(axisRawSignalY2);
            }
            if(identifier == "3"){
                sendSignal(axisRawSignalY3);
            }
            waitCalibResponse = cobID1;
            setTimeout(function(){
                axisRawMinLat = finalResponseData;
                var newSignal = signalComposer(axisRawMinLat, "2154", joystickLatSubindex); //param = response + header for zero long
                sendSignal(newSignal);
                calibrateMaxLat(identifier);
            },200);
        });
    }
    function calibrateMaxLat(identifier){
        $(".calibrate_bt_"+identifier).find(".validate_calib").off();
        $(".calibrate_bt_"+identifier).find(".status_calib").html("Set TOP position max");
        $(".calibrate_bt_"+identifier).find(".action_calib").html("<img src='images/top_arrow.png'>");
        $(".calibrate_bt_"+identifier).find(".validate_calib").on('click', function(){
            //alert("length = "+axisRawSignal.length+" ..send signal acquisition axis raw MIN : "+axisRawSignal);  
            if(identifier == "1"){
                sendSignal(axisRawSignalY1);
            }
            if(identifier == "2"){
                sendSignal(axisRawSignalY2);
            }
            if(identifier == "3"){
                sendSignal(axisRawSignalY3);
            }
            waitCalibResponse = cobID1;
            setTimeout(function(){
                axisRawMaxLat = finalResponseData;
                var newSignal = signalComposer(axisRawMaxLat, "2254", joystickLatSubindex); //param = response + header for zero long
                sendSignal(newSignal);
                calibrateZeroLat(identifier);
            },200);
        });
    }
    function calibrateZeroLat(identifier){
        $(".calibrate_bt_"+identifier).find(".validate_calib").off();
        $(".calibrate_bt_"+identifier).find(".status_calib").html("Set ZERO position");
        $(".calibrate_bt_"+identifier).find(".action_calib").html("<img src='images/zero_arrow.png'>");
        $(".calibrate_bt_"+identifier).find(".validate_calib").on('click', function(){
            //alert("length = "+axisRawSignal.length+" ..send signal acquisition axis raw MIN : "+axisRawSignal);  
            if(identifier == "1"){
                sendSignal(axisRawSignalY1);
            }
            if(identifier == "2"){
                sendSignal(axisRawSignalY2);
            }
            if(identifier == "3"){
                sendSignal(axisRawSignalY3);
            }
            waitCalibResponse = cobID1;
            setTimeout(function(){
                axisRawZeroLat = finalResponseData;
                var newSignal = signalComposer(axisRawZeroLat, "2054", joystickLatSubindex); //param = response + header for zero long
                sendSignal(newSignal);
                resetCalibration(identifier);
            },200);
        });
    }
    
    function resetCalibration(identifier){
        $(".calibrate_bt_"+identifier).find(".validate_calib").off();
        $(".calibrate_bt_"+identifier).find(".status_calib").html("Joystick "+identifier+ " is calibrated");
        $(".calibrate_bt_"+identifier).find(".action_calib").html("");
        $(".calibrate_bt_"+identifier).find(".validate_calib").on('click', function(){
            switch(identifier){
                case "1":
                    calibrateBt1.find(".calibrate_tool").addClass("hidden");
                    calibrateBt1.find("button").removeClass("hidden");
                    $(".calibrate_bt_"+identifier).find(".validate_calib").off();
                    break;
                case "2":
                    calibrateBt2.find(".calibrate_tool").addClass("hidden");
                    calibrateBt2.find("button").removeClass("hidden");
                    $(".calibrate_bt_"+identifier).find(".validate_calib").off();
                    break;
                case "3":
                    calibrateBt3.find(".calibrate_tool").addClass("hidden");
                    calibrateBt3.find("button").removeClass("hidden");
                    $(".calibrate_bt_"+identifier).find(".validate_calib").off();
                    break;
            }
        });
    }
    
    function resetCalibrationVerif(joystick){
        console.log("index verif global" +indexVerifGlobal);
        switch(joystick){
            case "joystick1":
                joystick1Val.find(".x_value_joy").html(0);
                joystick1Val.find(".y_value_joy").html(0);
                joystick1Val.find(".maxx_value_joy").html(0);
                joystick1Val.find(".minx_value_joy").html(0);
                joystick1Val.find(".maxy_value_joy").html(0);
                joystick1Val.find(".miny_value_joy").html(0);
                break;
            case "joystick2":
                joystick2Val.find(".x_value_joy").html(0);
                joystick2Val.find(".y_value_joy").html(0);
                joystick2Val.find(".maxx_value_joy").html(0);
                joystick2Val.find(".minx_value_joy").html(0);
                joystick2Val.find(".maxy_value_joy").html(0);
                joystick2Val.find(".miny_value_joy").html(0);
                break;
            case "joystick3":
                joystick3Val.find(".x_value_joy").html(0);
                joystick3Val.find(".y_value_joy").html(0);
                joystick3Val.find(".maxx_value_joy").html(0);
                joystick3Val.find(".minx_value_joy").html(0);
                joystick3Val.find(".maxy_value_joy").html(0);
                joystick3Val.find(".miny_value_joy").html(0);
                break;
        }
    }
    
    function verifyCalibration(joystick){
        pingGetAxisValue(joystick);
        setTimeout(function(){
//            console.log("index verif global" +indexVerifGlobal);
//            switch(joystick){
//                case "joystick1":
                    joy1currX.html(axisRawValueX1);
                    joy1currY.html(axisRawValueY1);
                    if(axisRawValueX1 > parseInt(joy1maxX.html())){
                        joy1maxX.html(axisRawValueX1);
                    }
                    if(axisRawValueX1 < parseInt(joy1minX.html())){
                        joy1minX.html(axisRawValueX1);
                    }
                    if(axisRawValueY1 > parseInt(joy1maxY.html())){
                        joy1maxY.html(axisRawValueY1);
                    }
                    if(axisRawValueY1 < parseInt(joy1minY.html())){
                        joy1minY.html(axisRawValueY1);
                    }
//                    break;
//                case "joystick2":
//                    joystick2Val.find(".x_value_joy").html(axisRawValueX2);
//                    joystick2Val.find(".y_value_joy").html(axisRawValueY2);
//                    if(axisRawValueX2 > parseInt(joystick2Val.find(".maxx_value_joy").html())){
//                        joystick2Val.find(".maxx_value_joy").html(axisRawValueX2);
//                    }
//                    if(axisRawValueX2 < parseInt(joystick2Val.find(".minx_value_joy").html())){
//                        joystick2Val.find(".minx_value_joy").html(axisRawValueX2);
//                    }
//                    if(axisRawValueY2 > parseInt(joystick2Val.find(".maxy_value_joy").html())){
//                        joystick2Val.find(".maxy_value_joy").html(axisRawValueY2);
//                    }
//                    if(axisRawValueY2 < parseInt(joystick2Val.find(".miny_value_joy").html())){
//                        joystick2Val.find(".miny_value_joy").html(axisRawValueY2);
//                    }
//                    break;
//                case "joystick3":
//                    joystick3Val.find(".x_value_joy").html(axisRawValueX3);
//                    joystick3Val.find(".y_value_joy").html(axisRawValueY3);
//                    if(axisRawValueX3 > parseInt(joystick3Val.find(".maxx_value_joy").html())){
//                        joystick3Val.find(".maxx_value_joy").html(axisRawValueX3);
//                    }
//                    if(axisRawValueX3 < parseInt(joystick3Val.find(".minx_value_joy").html())){
//                        joystick3Val.find(".minx_value_joy").html(axisRawValueX3);
//                    }
//                    if(axisRawValueY3 > parseInt(joystick3Val.find(".maxy_value_joy").html())){
//                        joystick3Val.find(".maxy_value_joy").html(axisRawValueY1);
//                    }
//                    if(axisRawValueY3 < parseInt(joystick3Val.find(".miny_value_joy").html())){
//                        joystick3Val.find(".miny_value_joy").html(axisRawValueY1);
//                    }
//                    break;
//            }
        },250);
    };         
    
    function pingGetAxisValue(joystick){
        
//        switch(joystick){
//            case "joystick1":   
                pingVal(axisRawSignalX1Final);                
                setTimeout(function(){
                    axisRawValueX1 = finalResponseData;  
                    var part1resp = axisRawValueX1.substring(0,2);
                    axisRawValueX1 = part1resp;  
                    axisRawValueX1 = convertHexa(axisRawValueX1);                    
                    
                    setTimeout(function(){
                        pingVal(axisRawSignalY1Final);
                        setTimeout(function(){
                            axisRawValueY1 = finalResponseData; 
                            var part1resp = axisRawValueY1.substring(0,2);
                            axisRawValueY1 = part1resp;  
                            axisRawValueY1 = convertHexa(axisRawValueY1);
                        },60);
                    },50);
                },40);     
//            break;
//            case "joystick2":   
//                pingVal(axisRawSignalX2);                
//                setTimeout(function(){
//                    axisRawValueX2 = finalResponseData;  
//                    var part1resp = axisRawValueX2.substring(0,2);
//                    var part2resp = axisRawValueX2.substring(2,4);
//                    axisRawValueX2 = part2resp+part1resp;  
//                    axisRawValueX2 = convertHexa2(axisRawValueX2);
//                    
//                    pingVal(axisRawSignalY2);
//                    setTimeout(function(){
//                        axisRawValueY2 = finalResponseData; 
//                        var part1resp = axisRawValueY1.substring(0,2);
//                        var part2resp = axisRawValueY1.substring(2,4);
//                        axisRawValueY2 = part2resp+part1resp;  
//                        axisRawValueY2 = convertHexa2(axisRawValueY2);
//                    },150);
//                },150);     
//            break;
//            case "joystick3":   
//                pingVal(axisRawSignalX3);                
//                setTimeout(function(){
//                    axisRawValueX3 = finalResponseData;  
//                    var part1resp = axisRawValueX3.substring(0,2);
//                    var part2resp = axisRawValueX3.substring(2,4);
//                    axisRawValueX3 = part2resp+part1resp;  
//                    axisRawValueX3 = convertHexa2(axisRawValueX3);
//                    
//                    pingVal(axisRawSignalY3);
//                    setTimeout(function(){
//                        axisRawValueY3 = finalResponseData; 
//                        var part1resp = axisRawValueY3.substring(0,2);
//                        var part2resp = axisRawValueY3.substring(2,4);
//                        axisRawValueY3 = part2resp+part1resp;  
//                        axisRawValueY3 = convertHexa2(axisRawValueY3);
//                    },150);
//                },150);     
//            break;
//        }        
    }
    
    function pingVal(signal){
        sendSignal(signal);
        waitCalibResponse = cobID1;  
    }
    
    
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// PING GET INFO VERSION ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    $(".bt_get_config").on('click', function(){
        _MODE = "CALIBRATION";
        pingGetInfo(globalName, cobID2);
        setTimeout(function(){
            var newBootRelease = bootRelease.substring(6,8)+"."+bootRelease.substring(4,6);
            $(".boot_config").html(newBootRelease);
            var newFPGARelease = FPGARelease.substring(6,8)+FPGARelease.substring(4,6)+"."+FPGARelease.substring(2,4)+FPGARelease.substring(0,2);
            $(".fpga_config").html(newFPGARelease);
            var newsoftwareRelease = softwareRelease.substring(6,8)+"."+softwareRelease.substring(4,6);
            $(".sw_config").html(newsoftwareRelease);
            var newunicID = unicID.substring(14,16)+"."+unicID.substring(12,14)+"."+unicID.substring(10,12)+"."+unicID.substring(8,10)+" "+unicID.substring(6,8)+"."+unicID.substring(4,6)+"."+unicID.substring(2,4)+"."+unicID.substring(0,2);
            $(".unic_config").html(newunicID);
        },1200);
        
    });
    
    function pingGetInfo(model, id){
        switch(model){
            case "ELEGANCE":
                pingTSSC(Cal_merde+Cal_dlc+id+"4018100300000000",id);                
                setTimeout(function(){
                    bootRelease = finalResponseData;                    
                    pingTSSC(Cal_merde+Cal_dlc+id+"4018100400000000",id);
                    setTimeout(function(){
                        FPGARelease = finalResponseData;
                        pingTSSC(Cal_merde+Cal_dlc+id+"4018100700000000",id);
                        setTimeout(function(){
                            softwareRelease = finalResponseData;
                            pingTSSC(Cal_merde+Cal_dlc+id+"4018100500000000",id);
                            setTimeout(function(){
                                var unicIDmsb = finalResponseData;
                                pingTSSC(Cal_merde+Cal_dlc+id+"4018100600000000",id);
                                setTimeout(function(){
                                    var unicIDlsb = finalResponseData;
                                    unicID = unicIDmsb+unicIDlsb;
                                },200);
                            },200);
                        },200);
                    },200);
                },200);     
            break;            
            case "OMEGA":
//                pingTSSC(Cal_merde+Cal_dlc+Cal_canid+"4018100300000000",id);                
//                setTimeout(function(){
//                    bootRelease = finalResponseData;                    
//                    pingTSSC(Cal_merde+Cal_dlc+Cal_canid+"4018100400000000",id);
//                    setTimeout(function(){
//                        FPGARelease = finalResponseData;
//                        pingTSSC(Cal_merde+Cal_dlc+Cal_canid+"4018100700000000",id);
//                        setTimeout(function(){
//                            softwareRelease = finalResponseData;
//                            pingTSSC(Cal_merde+Cal_dlc+Cal_canid+"4018100500000000",id);
//                            setTimeout(function(){
//                                var unicIDmsb = finalResponseData;
//                                pingTSSC(Cal_merde+Cal_dlc+Cal_canid+"4018100600000000",id);
//                                setTimeout(function(){
//                                    var unicIDlsb = finalResponseData;
//                                    unicID = unicIDmsb+unicIDlsb;
//                                },200);
//                            },200);
//                        },200);
//                    },200);
//                },200);     
            break;
        }        
    }
    
    function pingTSSC(signal, id){
        sendSignal(signal);
        waitCalibResponse = cobID1;  
    }
    
    
    
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// DOWNLOAD FIRMWARE ////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function readSingleFile(evt) {
        //Retrieve the first (and only!) File from the FileList object
        var f = evt.target.files[0]; 

        if (f) {
          var r = new FileReader();
          r.onload = function(e) { 
                  var contents = e.target.result;
                  arrayOfLines = contents.split("\n");
                  showReadResult(f.name, f.type, f.size);
          }
          r.readAsText(f);
        } else { 
          alert("Failed to load file");
        }
      }
   
    function showReadResult(name, type, size){
        $(".testing_upl .content_upl").html( "<span>File is read ! </span> | " 
            +"<b>Name</b> : " + name + "<br>"
            +"<b>Nb of lines </b>: "+ arrayOfLines.length
            +" | <b>Size </b>: " + size + " bytes<br/>"
        );
        if(arrayOfLines.length > 0){
            $(".testing_upl .start_download").removeClass("hidden");
            $(".testing_upl .stop_download").removeClass("hidden");
        }
    }
    document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
    document.getElementById('fileinput2').addEventListener('change', readSingleFile, false);
    document.getElementById('fileinput3').addEventListener('change', readSingleFile, false);
    
    $(".testing_upl .start_download").on('click', function(){
        startDownload(cobID2);
        //sendSignal(Cal_merde+Cal_dlc+Cal_canid+"2f511f0100000000");
    });
    
    $(".testing_upl .stop_download").on('click', function(){
        stopDownload(cobID2);
    });
    
    function startDownload(canId){ 
        _MODE = "CALIBRATION";
        isDownloading = 1;
        downloadingBarProgress(arrayOfLines.length);
        $(".downloading_bar_container").removeClass("hidden");
        //stop application mode
        console.log("stop application mode");
        sendSignal(Cal_merde+Cal_dlc+canId+"2f511f0100000000");
        setTimeout(function(){
            console.log("start download mode");
            if(arrayOfLines[0].substring(0,1)== "+"){
                var lengthFirstLine = arrayOfLines[0].length-1;
                console.log(lengthFirstLine);
                var newval= lengthFirstLine.toString(16);
                console.log(newval);
                var customCAN = Cal_merde+Cal_dlc+canId+"21501f01"+newval+"000000";
                sendSignal(customCAN);
                setTimeout(function(){
                    var asciiToHex = "";
                    for(var index = 0;index < lengthFirstLine; index++){
                        asciiToHex += arrayOfLines[0].charCodeAt(index).toString(16);
                    }
                    sendMultipleSignalStart(asciiToHex, canId, 0);
                    console.log("------------------------------------------");                    
                },200);
            }else{
                alert("invalide file format");
                stopDownload(canId);
            }            
        },200);
    };
    function coreDownload(canId, startIndex){
        if(startIndex < arrayOfLines.length-1){
            lineDownloading = startIndex;
            if(arrayOfLines[startIndex].substring(0,1)== "+"){
                var lengthFirstLine = arrayOfLines[0].length-1;
                console.log(lengthFirstLine);
                var newval= lengthFirstLine.toString(16);
                console.log(newval);
                var customCAN = Cal_merde+Cal_dlc+canId+"21501f01"+newval+"000000";
                sendSignal(customCAN);
                setTimeout(function(){
                    var asciiToHex = "";
                    for(var index = 0;index < lengthFirstLine; index++){
                        asciiToHex += arrayOfLines[startIndex].charCodeAt(index).toString(16);
                    }
                    sendMultipleSignalStart(asciiToHex, canId, startIndex);
                    console.log("------------------------------------------");                    
                },200);
            }else{
                console.log("LINE "+startIndex);
                var lengthFirstLine = arrayOfLines[startIndex].length-1;
                var newval = lengthFirstLine.toString(16);
                if(lengthFirstLine <= 15){newval = "0"+newval}
                var customCAN = Cal_merde+Cal_dlc+canId+"21501f01"+newval+"000000";
                sendSignal(customCAN);
                setTimeout(function(){
                    var asciiToHex = "";
                    for(var index = 0;index < lengthFirstLine; index++){
                        asciiToHex += arrayOfLines[startIndex].charCodeAt(index).toString(16);
                    }
                    sendMultipleSignal(asciiToHex, canId, startIndex);
                    
                },2);
            }
        }else{
            setTimeout(function(){
                stopDownload(canId);
            },500);
            
        }
    };
    function stopDownload(canId){         
        //application mode
        
        console.log("stop download mode");
        
        waitDownloadResponse = "";
        isDownloading = 0;
        $(".downloading_bar_container").addClass("hidden");
        sendSignal(Cal_merde+Cal_dlc+canId+"2f511f0101000000");
        //sendSignal("002400806d68d7551407f09b861e3aad000549a8440800000000072d2f511f0101000000");
    };
    
    function downloadingBarProgress(totalLine){
        var interval  = setInterval(function(){            
            if(isDownloading >0){
                var percentLine = Math.round((lineDownloading/totalLine)*100);
                downloadingBar.css("width",percentLine+"%");
                downloadingBarContent.html(percentLine+" %");
            }else{
                clearInterval(interval);
            }            
        }, 2000);
    }
    function sendMultipleSignalStart(signal, canId, startIndex){
        var nbMessage = parseInt((signal.length/2)/7);
        if(nbMessage == 0){
            nbMessage = 1;
        }
        if(((signal.length/2)%7 > 0)){
            nbMessage += 1;
        }
        var dataZero; 
        sendSingle(0);
        function sendSingle(index){
            var t;                        
            var c = 0;
            var n = 0;
            if(index%2 == 0){
                t = 0;
            }else{
                t = 16;
            }
            if(index == (nbMessage-1)){
                c = 1;
                n = 0+(7-(signal.length/2)%7)*2; 
                if(n == 14){n = 0}
            }
            dataZero = 0+parseInt(t)+parseInt(n)+parseInt(c); 
            var hexDataZero = dataZero.toString(16);
            if(hexDataZero.length <2){
                hexDataZero = "0"+hexDataZero;
            }
            var startInd = (14*index);
            var endInd = (14*index)+14;
            var data = signal.substring(startInd, endInd);
            data = addZeroAfter(data,14);
            //console.log('t+n+c :'+t+" "+n+" "+c)
            sendSignal(Cal_merde+Cal_dlc+canId+hexDataZero+data);
            
            waitDownloadResponse = cobID1;
            var checkResponse = setInterval(function(){
//                console.log("check response");
//                console.log("continueDownload : "+ continueDownload + "wait dl :"+waitDownloadResponse)
                if(waitDownloadResponse !== ""){
                    if(continueDownload > 0){                                
                        continueDownload = 0;
//                        console.log("on rentre dans continue download");
                        if(index == (nbMessage-1) && index !=0){
                            coreDownload(canId, startIndex+1)
                        }else{
                            setTimeout(function(){
                                sendSingle(index+1);
                            },5);
                        }
                        clearInterval(checkResponse);
//                        console.log("launch core download");
                        waitDownloadResponse = "";
                    }
                }else{
                    clearInterval(checkResponse);
//                    console.log("stop check interval");
                }
            }, 5);
            
        }
           
    }
    function sendMultipleSignal(signal, canId, startIndex){
        var nbMessage = parseInt((signal.length/2)/7);
        if(nbMessage == 0){
            nbMessage = 1;
        }
        if(((signal.length/2)%7 > 0)){
            nbMessage += 1;
        }
        var dataZero; 
        sendSingle(0);
        function sendSingle(index){
            var t;                        
            var c = 0;
            var n = 0;
            if(index%2 == 0){
                t = 0;
            }else{
                t = 16;
            }
            if(index == (nbMessage-1)){
                c = 1;
                n = 0+(7-(signal.length/2)%7)*2; 
                if(n == 14){n = 0}
            }
            dataZero = 0+parseInt(t)+parseInt(n)+parseInt(c); 
            var hexDataZero = dataZero.toString(16);
            if(hexDataZero.length <2){
                hexDataZero = "0"+hexDataZero;
            }
            var startInd = (14*index);
            var endInd = (14*index)+14;
            var data = signal.substring(startInd, endInd);
            data = addZeroAfter(data,14);
            //console.log('t+n+c :'+t+" "+n+" "+c)
            sendSignal(Cal_merde+Cal_dlc+canId+hexDataZero+data);
            if(index == (nbMessage-1) && index !=0){
                coreDownload(canId, startIndex+1)
            }else{
                setTimeout(function(){
                    sendSingle(index+1);
                },1);
            }
            
        }
           
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// ON CLICK FUNCTION ////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //différentes fonctions d'envoi de signaux au tsui
    $("#start_node").on('click', function(){sendSignal("002400806d68d7551407f09b861e3aad000549a84402000000000000012D000000000000");});    
    $("#stop_node").on('click', function(){sendSignal("002400806d68d7551407f09b861e3aad000549a84402000000000000022D000000000000");});
    $("#start_led").on('click', function(){sendSignal("002400806d68d7551407f09b861e3aad000549a84408000000000328FFFFFFFFFFFFFFFF");});
    $("#stop_led").on('click', function(){sendSignal("002400806d68d7551407f09b861e3aad000549a844080000000003280000000000000000");});
    $("#record_log").on('click', function(){generateJsonLog();});
    $("#print_log").on('click', function(){printJsonLog(jsonLog);});
    
    $(".start_node_bt").on('click', function(){
        sendSignal(startNodeMsg);
    });
    $(".stop_node_bt").on('click', function(){
        sendSignal(stopNodeMsg);
    });
    
    $("#send_pic").on('click', function(){
        var signal = $("#msg_pic").val();
        alert(convertHexaPic(signal, 12));
    });
    
    $(".toolbox").on('click', function(){
        _MODE = "TOOLBOX";
        sendSignal("002400806d68d7551407f09b861e3aad000549a84402000000000000012D000000000000");
    });
    $(".test_bt_home").on('click', function(){
        _MODE = "PRETEST";
        sendSignal("002400806d68d7551407f09b861e3aad000549a84402000000000000012D000000000000");
    });
    
    //switch de panel sur la toolbox ingé
    $("#content_toolbox .show_joystick").on('click', function(){
        $("#content_toolbox .diag_inge .button_show").fadeOut(300);
        $("#content_toolbox .diag_inge .led_show").fadeOut(300);
        setTimeout(function(){
            $("#content_toolbox .diag_inge .joystick_show").fadeIn(300);
        },300);        
    });
    $("#content_toolbox .show_button").on('click', function(){
        $("#content_toolbox .diag_inge .joystick_show").fadeOut(300);
        $("#content_toolbox .diag_inge .led_show").fadeOut(300);
        setTimeout(function(){
            $("#content_toolbox .diag_inge .button_show").fadeIn(300);
        },300);
        sendSignalPic("2")
    });
    $("#content_toolbox .show_led").on('click', function(){
        $("#content_toolbox .diag_inge .joystick_show").fadeOut(300);
        $("#content_toolbox .diag_inge .button_show").fadeOut(300);
        setTimeout(function(){
            $("#content_toolbox .diag_inge .led_show").fadeIn(300);
        },300);
        sendSignalPic("1");
    });
    $("#content_toolbox .get_conf_inge").on('click', function(){        
        setTimeout(function(){
            _MODE = "TOOLBOX";
        },1500);
    });
    
    $("#dialog-link-download").on('click', function(){
        $("#content_toolbox .panels").fadeOut(300);
        _MODE = "TOOLBOX";
        setTimeout(function(){
            $("#content_toolbox .download_inge").fadeIn(300);
            $("#dialog-link-diagnostic").removeClass("selected");
            $("#dialog-link-calibration").removeClass("selected");
            $("#dialog-link-download").addClass("selected");
        },300);
    });    
    $("#dialog-link-diagnostic").on('click', function(){
        _MODE = "TOOLBOX";
        $("#content_toolbox .panels").fadeOut(300);
        setTimeout(function(){
            $("#content_toolbox .diag_inge").fadeIn(300);
            $("#dialog-link-download").removeClass("selected");
            $("#dialog-link-calibration").removeClass("selected");
            $("#dialog-link-diagnostic").addClass("selected");
        },300);
    });
    $("#dialog-link-calibration").on('click', function(){
        $("#content_toolbox .panels").fadeOut(300);
        setTimeout(function(){
            $("#content_toolbox .calibration_inge").fadeIn(300);
            $("#dialog-link-download").removeClass("selected");
            $("#dialog-link-diagnostic").removeClass("selected");
            $("#dialog-link-calibration").addClass("selected");
        },300);
    });
    
    srtlContainer.find(".srtl").on('click', function(){
        if($(this).hasClass("on")){
            $(this).removeClass("on");
            $(this).find("img").attr('src', 'images/switch_off.png');
            sendSignalPic("4");
            sendSignal(startNodeMsg);
        }else{
            $(this).addClass("on");
            $(this).find("img").attr('src', 'images/switch_on.png');
            sendSignalPic("3");
            
        }
    });
    
    
   $(".start_node").on('click', function(){
       var sign = "002400806d68d7551407f09b861e3aad000549a8440200000000000001"+nodeID+"000000000000";
       console.log(startNodeMsg, sign);
       sendSignal(sign);
       
   });
   
   $(".agila_conf").on('click', function(){
       var sign = "002400806d68d7551407f09b861e3aad000549a844080000"+cobID2+"2f01300101000000";
       console.log(sign);
       sendSignal(sign);
       
   });
   $(".front_panel_led1").on('click', function(){
       var sign = "002400806d68d7551407f09b861e3aad000549a844020000000004200200000000000000";
       console.log(sign);
       sendSignal(sign);
       
   });
   $(".front_panel_led2").on('click', function(){
       var sign = "002400806d68d7551407f09b861e3aad000549a844020000000004202000000000000000";
       console.log(sign);
       sendSignal(sign);
       
   });
   $(".front_panel_led3").on('click', function(){
       var sign = "002400806d68d7551407f09b861e3aad000549a844020000000004200800000000000000";
       console.log(sign);
       sendSignal(sign);
       
   });
 
   $(".bouton.newjoy").on('click', function(){
       _MODE = "PRETEST";
       alert("mode pretest");
       
   });
 
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// SEND SIGNAL TO DRIVER ////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    
    function sendSignal(signal){        
        var jsonData = '{"type":"signal", "msg":"'+signal+'"}';
        console.log(jsonData);
        ws.send(jsonData);
    }
    function sendSignalPic(signal){        
        var jsonData = '{"type":"signal_pic", "msg":"'+signal+'"}';
        console.log(jsonData);
        ws.send(jsonData);
    }
    
    function convertHexa(hexaVal){
        var newval = parseInt(hexaVal, 16);
        if(newval>0x80){
           newval = newval-0x100; 
        }
        return newval;
    }
    function convertHexaPic(hexaVal){
        var newval = parseInt(hexaVal, 16);        
        return newval;
    }
    function convertHexa2(hexaVal){
        var a = parseInt(hexaVal, 16);
        if ((a & 0x8000) > 0) {
            a = a - 0x10000;
         }
        return a;
    }
    function addHexVal(c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 8) { hexStr = '0' + hexStr; } // Zero pad.
        return hexStr;
    }
    
    function hexadecimalToDecimal(hexadecimalValue) {
        return parseInt(hexadecimalValue, 16);
    };
    
    
});