
        window.onload=function(){
            var socket=io.connect();

            document.getElementById('login_bt').onclick=function(){
                var id_1=document.getElementById('name2').value;
                var password_1=document.getElementById('pw2').value;
                if(id_1==""||password_1==""){
                    document.getElementById("error_message").innerHTML="아이디나 비밀번호를 입력하지 않았습니다.";
                }
                else{
                    socket.emit('join',{"Userid":id_1,"Password":password_1});
                    document.getElementById("error_message").innerHTML="아이디를 전송하였습니다";
                }

            };

            document.getElementById('login_bt').onclick=function(){
                var id_1=document.getElementById('name2').value;
                var password_1=document.getElementById('pw2').value;
                if(id_1==""||password_1==""){
                    document.getElementById("error_message").innerHTML="아이디나 비밀번호를 입력하지 않았습니다.";
                }
                else{
                    document.getElementById("error_message").innerHTML="아이디를 전송하였습니다";
                    socket.emit('login',{"Userid":id_1,"Password":password_1});

                }

            };

            socket.on('errormessage',function(data){
                document.getElementById('error_message').innerHTML=data.error;
            });

            socket.on('main_frame_change',function(data){
                document.getElementById('main_frame').innerHTML=data.main_frame;
            });
        };