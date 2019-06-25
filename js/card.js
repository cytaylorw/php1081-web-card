
        let suits = ["S","H","D","C"];
        let backs = ["blue","gray","green","purple","red","yellow"];
        let result = {
            lvl: 0,
            score: 0,
            see: false,
        };
        let setting = {
            lvl: 1,
            time: 0,
        };
        let time = 0;
        let timer;
        let isGame;

        $(function(){
            $("#score").text(result.score);
            $("#start").on("click",function(){
                setting.time=$("#gtime").val();
                setting.lvl=parseInt($("#lvl").val());
                result.lvl=setting.lvl;
                newCard(result.lvl);
                $(this).attr("disabled",true);
                $("#gtime, #lvl").attr("disabled",true);
                $("#see").attr("disabled",false);
            });

            $("#see").on("click",function(){
                if($("#see i").hasClass("fa-eye")){
                    result.see = true;
                    $(".front").css({"opacity":"0.7"});
                    $("#see i").removeClass("fa-eye");
                    $("#see i").addClass("fa-eye-slash")
                }else{
                    $(".front").css({"opacity":"1"});
                    $("#see i").removeClass("fa-eye-slash");
                    $("#see i").addClass("fa-eye")
                }
            });
                   
            $("body").on("click",".card",function(){
                if(isGame){
                    if($(".open").length <2){
                        $(this).addClass("open");
                    }
                    if($(".open").length == 2){
                        if($(".open").eq(0).data("card") == $(".open").eq(1).data("card")){
                            result.score++;
                            $("#score").text(result.score);
                            let open = $(".open").addClass("clear");
                            setTimeout(function(){
                                open.fadeTo(500,0).removeClass("open");
                                if($(".clear").length == $(".card").length){
                                    setTimeout(function(){
                                        if(result.lvl<51){
                                            alert(`恭喜，清除第${result.lvl}關!`);
                                            newCard(++result.lvl);
                                        }else{
                                            alert(`恭喜，清除第${result.lvl}關，通關了!`);
                                            gameResult();
                                        }
                                    },500);
                                }
                            },500);
                        }else{
                            setTimeout(function(){$(".open").removeClass("open")},500);
                        }
                    }
                }
            })
        })
        function newCard(lvl){
            $("#see i").removeClass("fa-eye-slash");
            $("#see i").addClass("fa-eye")
            $(".main").empty();
            for(let i=0;i<lvl+1;i++){
                $(".main").append(/*html*/`
                <div class="card">
                    <div class="front"></div>
                    <div class="back"></div>
                </div>
                `);
            }
            if(lvl>15){
                $(".main").css({
                    "width":`80%`,
                    });
            }
            if(lvl>25){
                let adj = Math.ceil((lvl-25)/15);
                $(".main").css({
                    "transform": `scale(${1-adj*0.1})`,
                    "width":`${adj*15+70}%`,
                    });
                if(lvl > 50) $(".main").css({"margin-top": "-25px"});         
            } 
            $(".front").css({"background-image": `url("./img/${backs[lvl%6]}_back.jpg")`});
            randomCard();
            isGame=true;
            time=setting.time;
            result.score = 0;
            $("#score").text(result.score);
            $("#lvl").val(result.lvl);
            $("#time").text(time);
            clearInterval(timer);
            timer=setInterval(game,1000);
        }

        function randomCard(){
                let l = $(".card").length;
                for(let i=0;i<l;i++){
                    let add;
                    let s;
                    do{
                        add = Math.floor(Math.random()*13+1);
                        s = Math.floor(Math.random()*4);
                    }while($(`.card[data-card="${add}${suits[s]}"]`).length);
                    $(".card").eq(i).find(".back").css({"background-image": `url("./img/${add}${suits[s]}.jpg")`});
                    $(".card").eq(i).attr("data-card",add+suits[s]);
                    $(".card").eq(i).clone().appendTo(".main");
                    
                }
                l = $(".card").length;
                for(let i=0;i<l;i++){
                    let target = Math.floor(Math.random()*$(".card").length);
                    $(".card").eq(target).insertAfter($(".card").eq(i));
                }
                for(let i=0;i<l;i++){
                    let target = Math.floor(Math.random()*$(".card").length);
                    $(".card").nextAll(target).insertBefore($(".card").eq(i));
                }
                let l2 = l/2;
                for(let i=0;i<l2-1;i++){
                    let a =  $(".card").eq(i);
                    let an = $(".card").eq(i+1);
                    let b = $(".card").eq(l2+i);
                    let bn = $(".card").eq(l2+i+1);
                    an.insertBefore(b);
                    bn.insertBefore(a);
                }
        }

        function game(){
            time--;
            $("#time").text(time);
            if(time < 1){
                isGame=false;
                if($(".clear").length != $(".card").length){
                    let a = result.lvl;
                    let b = result.score;
                    setTimeout(function(){alert(`時間到!\n\t關數：${a}\n\t分數：${b}`)},100);
                    clearInterval(timer);
                    gameResult();
                }
            }
        }

        function gameResult(){
            $("#start, #gtime, #lvl").attr("disabled",false);
            $("#see").attr("disabled",true);
            let a = setting.lvl;
            let b = result.lvl;
            let c = result.score;
            let d = setting.time;
            let e = (result.see)?"*":"";
            if(lvl == 51 && time>0){
                $("#record").append(`<li>第${a}關到第${b}關(${c}分${d-time}秒)，每關${d}秒${e}</li>`);
            }else{
                $("#record").append(`<li>第${a}關到第${b}關(${c}分)，每關${d}秒${e}</li>`);
            }
            if($("#record li").length>10)$("#record li").eq(0).remove();
        }