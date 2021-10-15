function isFullScreen() {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
    )
        return !0;
    else return !!0;
}
function run() {
    // const caro = [[{index:0;belongTo:0},{}],[],[]];
    const caro = [];
    const minReachedToWin = 5;
    const amountSquare = parseInt(playGround.gData("square"));
    const squareRes = playGround.gData("width");

    let currentZoom = 1,
        lastCurrentZoom = 1;

    const zoomMin = 1;
    const zoomMax = 3;
    let dragged = false;

    // const users = {
    //     1: { name: "Mai Thanh Binh" },
    //     2: { name: "Bui Ngoc Quynh Nhu" },
    //     current: 1,
    //     userName: $("#user-name"),
    //     getCurrentUser() {
    //         return this[this.current].name;
    //     },
    //     nextUser() {
    //         this.current++;
    //         this.updateCurrent();
    //         this.updateDOM();
    //     },
    //     prevUser() {
    //         this.current--;
    //         this.updateCurrent();
    //         this.updateDOM();
    //     },
    //     updateCurrent() {
    //         let _min = 1;
    //         _max = 2;
    //         let order = this.current;
    //         order = order > _max ? _min : order;
    //         order = order < _min ? _max : order;
    //         this.current = order;
    //     },
    //     updateDOM() {
    //         this.userName.innerText = this.getCurrentUser();
    //     },
    // };

    const users = initUser();

    setFullScreen();

    if (amountSquare && amountSquare > 0) {
        init(amountSquare);

        // reAlignCenter();
        // window.addEventListener("resize", reAlignCenter);

        users.updateDOM();

        interact();

        // unload();
    }

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    function interact() {
        const cl = "active";

        let eX,
            eY,
            startX,
            startY,
            diffX,
            diffY,
            down = false;

        let lastX = 0,
            lastY = 0;

        let doubleX,
            doubleY,
            doubleStartLength,
            doubleDiffLength,
            doubleDown = false;

        let lastZoom = 0;

        let dragging = false;

        let getXYFirstTimeTimeOut;

        let type = "";

        const animationDuration = 300;
        const animationEasing = "easeOutQuint";

        const ele = playGround;

        const limitRes = amountSquare * parseInt(squareRes);

        // l("limitRes", limitRes);

        getXYFirstTime();
        // window.addEventListener("resize", getXYFirstTime);

        window.addEventListener("touchstart", mdown);
        window.addEventListener("touchmove", mmove);
        window.addEventListener("touchend", mup);

        window.addEventListener("mousedown", mdown);
        window.addEventListener("mousemove", mmove);
        window.addEventListener("mouseup", mup);
        // root.addEventListener("wheel", (e) => {
        // currentZoom = e.deltaY > 0 ? -0.2 : 0.2;
        // l(currentZoom);
        // zoomGame(currentZoom);
        // lastCurrentZoom = currentZoom;
        // });

        // ele.addEventListener("click", clickCheck);
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

        function getXYFirstTime() {
            // {
            //     let arr = window.getComputedStyle(ele).transform.split(",");

            //     diffX = parseInt(arr[4].trim());
            //     diffY = parseInt(arr[5].trim());
            //     currentZoom = parseInt(arr[3].trim());

            //     lastX = diffX;
            //     lastY = diffY;
            // }

            {
                diffX = 0;
                diffY = 0;
                currentZoom = 1;

                lastX = diffX;
                lastY = diffY;
            }
        }

        function getEX(e) {
            return e.x || e.touches[0].clientX;
        }
        function getEY(e) {
            return e.y || e.touches[0].clientY;
        }
        function getEXDouble(e) {
            return e.x || e.touches[1].clientX;
        }
        function getEYDouble(e) {
            return e.y || e.touches[1].clientY;
        }

        function calTwoPointsLength(a, b, aa, bb) {
            return Math.sqrt(Math.pow(a - aa, 2) + Math.pow(b - bb, 2));
        }

        function mdown(e) {
            if (!type) {
                type = e.type == "touchstart" ? "touchend" : "mouseup";
            }

            if (down) {
                doubleDown = true;
                doubleX = getEXDouble(e);
                doubleY = getEYDouble(e);

                doubleStartLength = calTwoPointsLength(
                    doubleX,
                    doubleY,
                    getEX(e) || eX,
                    getEY(e) || eY
                );

                // $("#user").html(`a -> b = ${doubleStartLength}`);
                return;
            }

            down = true;

            startX = getEX(e) - lastX;
            startY = getEY(e) - lastY;
        }
        function mup(e) {
            // l("up", down, e.type, "type", type);

            if (doubleDown) {
                doubleDown = false;

                // Keep the caro pad in the old position
                startX = -diffX + getEX(e);
                startY = -diffY + getEY(e);

                // $("#user").html(JSON.stringify(e.touches));

                lastCurrentZoom = currentZoom;

                return;
            }
            down = false;

            lastX = diffX || 0;
            lastY = diffY || 0;

            if (type == e.type) {
                // l("calling clickCheck");
                clickCheck(e);
            }
            // l("lastX", lastX, "lastY", lastY);
        }
        function clickCheck(e) {
            if (!dragging) {
                let square = e.target.closest(".square");

                if (square) {
                    updateGame(square);
                }
            }
            dragging = false;
        }
        function mmove(e) {
            // l("move", down, e.type);
            if (!down && !doubleDown) return;
            else {
                eX = getEX(e);
                eY = getEY(e);

                if (doubleDown) {
                    doubleX = getEXDouble(e);
                    doubleY = getEYDouble(e);

                    const newLength = calTwoPointsLength(
                        doubleX,
                        doubleY,
                        eX,
                        eY
                    );

                    doubleDiffLength = newLength - doubleStartLength;
                    // currentZoom =
                    //     doubleDiffLength > 0
                    //         ? currentZoom + 0.01
                    //         : currentZoom - 0.01;
                    let zoom = doubleDiffLength;
                    // lastZoom = doubleDiffLength;
                    // zoom = zoom > lastZoom ? Math.abs(zoom) : -Math.abs(zoom);
                    // if (lastZoom < zoom) {
                    //     currentZoom -= zoom;
                    // }

                    // currentZoom = 1 + zoom / 100;

                    // currentZoom=
                    // if (zoom < 0) {
                    //     zoom = 0;
                    // }
                    let percentZoom = zoom / window.innerHeight;
                    // if (!lastZoom) lastZoom = percentZoom;
                    // $("#user").html(
                    //     `Zoom ${zoom.toFixed(2)}|Zoom percent ${(
                    //         zoom / window.innerHeight
                    //     ).toFixed(
                    //         2
                    //     )}|doubleDiffLength ${doubleDiffLength.toFixed(
                    //         2
                    //     )}|currZoom ${currentZoom} ${Math.ceil(percentZoom)}`
                    // );

                    // zoomGame(percentZoom * Math.ceil(Math.abs(percentZoom)));
                    zoomGame(percentZoom * 10);
                    if (!dragging) dragging = true;

                    lastZoom = percentZoom;

                    return;
                }

                diffX = -(startX - eX);
                diffY = -(startY - eY);

                // anime({
                //     targets: ele,
                //     translateX: diffX,
                //     translateY: diffY,
                //     easing: animationEasing,
                //     duration: animationDuration,
                // });

                ele.style.transform = `translate(${diffX}px,${diffY}px)`;
                // ele.style.transform = `translate(${diffX}px,${diffY}px) scale(${currentZoom})`;

                if (!dragging && diffX != lastX && diffY != lastY) {
                    dragging = true;
                }

                if (!dragged) {
                    dragged = true;
                }
            }
        }
        function zoomGame(strength) {
            // playGround.style.zoom = strength;
            // currentZoom += strength;
            // $("#user").html(`currentZoom = ${currentZoom}`);
            currentZoom = lastCurrentZoom + strength;
            // l("currentZoom ", currentZoom, "lastCurrentZoom", lastCurrentZoom);
            // currentZoom = currentZoom > 3 ? 3 : currentZoom;
            if (currentZoom < zoomMin) {
                currentZoom = zoomMin;
                // lastCurrentZoom = strength;
            }
            if (currentZoom > zoomMax) {
                currentZoom = zoomMax;
            }
            // currentZoom=lastCurrentZoom?currentZoom

            playGround.style.zoom = currentZoom;
            // playGround.style.transform = `translate(${diffX}px,${diffY}px) scale(${currentZoom})`;
        }
        function updateGame(square = ele) {
            let obCaro = {};
            if (square.hasCl(cl)) {
                obCaro = updateRemove(square, cl);
            } else {
                obCaro = updateAdd(square, cl);
            }
            // l("caro", caro);
            if (obCaro.hasOwnProperty("checkWin")) {
                if (checkWin(obCaro)) {
                    alert(obCaro.userName + " IS WINNER!!!");
                }
            }
        }
        function updateRemove(square, cl) {
            users.prevUser();
            let order = users.getCurrent();

            if (square.hasCl(cl + order)) {
                square.removeCl(cl);
                square.removeCl(cl + order);

                // square.innerText = "";
            } else {
                users.nextUser();
            }
            return {};
        }
        function updateAdd(square, cl) {
            square.addCl(cl);
            square.addCl(cl + users.getCurrent());

            // square.innerText = users.getCurrentUser();

            let r = square.gAttr("r"),
                c = square.gAttr("c"),
                userName = users.getCurrentUser(),
                current = users.getCurrent();

            caro[r][c].state = 1;
            caro[r][c].belongTo = current;

            // caro.r[r] = { index: 1, belongTo: current };
            // caro.c[c] = { index: 1, belongTo: current };

            users.nextUser();
            return { r, c, userName, current, checkWin: "" };
        }
        function checkWin(lastCoord = { r, c, userName, current }) {
            let ii,
                jj,
                startingRow = parseInt(lastCoord.r),
                startingCol = parseInt(lastCoord.c);
            // l("caro=", caro);
            // l("CHECKWIN-=-==-=-=-=-=-=-");
            // l("lastCoord", lastCoord);

            let startCoord = {};
            let current = lastCoord.current;
            let userName = lastCoord.userName;
            let won = false;
            // let timeout = 0;
            let counter = 0;

            // doc
            startCoord.r = startingRow;
            startCoord.c = startingCol;
            ii = startingRow;
            jj = startingCol;

            counter = 1;
            // timeout = 0;
            while (
                ++ii < amountSquare &&
                caro[ii][jj].state != 0 &&
                caro[ii][jj].belongTo == current &&
                // ++timeout < 100 &&
                ++counter
            ) {
                startCoord.r = ii;
            }
            if (counter == minReachedToWin) {
                // l("[doc 1]WINNER IS " + userName);
                return true;
            } else {
                // l("starting Coord=", startCoord);
                let ii = startCoord.r;
                counter = 1;
                // timeout = 0;
                while (
                    --ii >= 0 &&
                    caro[ii][jj].state != 0 &&
                    caro[ii][jj].belongTo == current &&
                    // ++timeout < 100 &&
                    ++counter
                ) {}

                if (counter == minReachedToWin) {
                    // l("[doc 2]WINNER IS " + userName);
                    return true;
                }
            }

            // ngang
            startCoord.r = startingRow;
            startCoord.c = startingCol;
            ii = startingCol;
            jj = startingRow;

            counter = 1;
            // timeout = 0;
            // l("ngang", ii + 1);
            while (
                ++ii < amountSquare &&
                caro[jj][ii].state != 0 &&
                caro[jj][ii].belongTo == current &&
                // ++timeout < 100 &&
                ++counter
            ) {
                startCoord.c = ii;
            }
            if (counter == minReachedToWin) {
                // l("[ngang 1]WINNER IS " + userName);
                return true;
            } else {
                // l("starting Coord=", startCoord);
                let ii = startCoord.c;
                counter = 1;
                // timeout = 0;
                while (
                    --ii >= 0 &&
                    caro[jj][ii].state != 0 &&
                    caro[jj][ii].belongTo == current &&
                    // ++timeout < 100 &&
                    ++counter
                ) {}

                if (counter == minReachedToWin) {
                    // l("[ngang 2]WINNER IS " + userName);
                    return true;
                }
            }

            // xeo xuong phai
            startCoord.r = startingRow;
            startCoord.c = startingCol;
            ii = startingRow;
            jj = startingCol;

            counter = 1;
            // timeout = 0;
            while (
                ++ii < amountSquare &&
                ++jj < amountSquare &&
                caro[ii][jj].state != 0 &&
                caro[ii][jj].belongTo == current &&
                // ++timeout < 100 &&
                ++counter
            ) {
                startCoord.r = ii;
                startCoord.c = jj;
            }
            if (counter == minReachedToWin) {
                // l("[xeo phai 1]WINNER IS " + userName);
                return true;
            } else {
                // l("starting Coord=", startCoord);
                let ii = startCoord.r,
                    jj = startCoord.c;
                counter = 1;
                // timeout = 0;
                while (
                    --ii >= 0 &&
                    --jj >= 0 &&
                    caro[ii][jj].state != 0 &&
                    caro[ii][jj].belongTo == current &&
                    // ++timeout < 100 &&
                    ++counter
                ) {}

                if (counter == minReachedToWin) {
                    // l("[xeo phai 2]WINNER IS " + userName);
                    return true;
                }
            }

            // xeo xuong trai
            startCoord.r = startingRow;
            startCoord.c = startingCol;
            ii = startingRow;
            jj = startingCol;

            counter = 1;
            // timeout = 0;
            while (
                ++ii < amountSquare &&
                --jj >= 0 &&
                caro[ii][jj].state != 0 &&
                caro[ii][jj].belongTo == current &&
                // ++timeout < 100 &&
                ++counter
            ) {
                startCoord.r = ii;
                startCoord.c = jj;
            }
            if (counter == minReachedToWin) {
                // l("[xeo trai 1]WINNER IS " + userName);
                return true;
            } else {
                // l("starting Coord=", startCoord);
                let ii = startCoord.r,
                    jj = startCoord.c;
                counter = 1;
                // timeout = 0;
                while (
                    --ii >= 0 &&
                    ++jj < amountSquare &&
                    caro[ii][jj].state != 0 &&
                    caro[ii][jj].belongTo == current &&
                    // ++timeout < 100 &&
                    ++counter
                ) {}

                if (counter == minReachedToWin) {
                    // l("[xeo trai 2]WINNER IS " + userName);
                    return true;
                }
            }
            return false;
        }
    }

    function init(amount = 0) {
        generateLayout();

        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        function generateLayout() {
            caro.splice(0, caro.length);
            for (let ii = 0; ii < amount; ii++) {
                let row = generateRowHtml();
                let rowArr = [];
                // caro.ii = [];
                // caro.ii["index"] = 0;

                for (let jj = 0; jj < amount; jj++) {
                    let sq = {};
                    sq["state"] = 0;
                    sq["belongTo"] = null;

                    rowArr.push(sq);

                    // caro.c[jj] = {};
                    // caro.c[jj]["index"] = 0;
                    let square = generateSquareHtml(ii, jj);
                    row.appendChild(square);
                }

                caro.push(rowArr);

                playGround.appendChild(row);
            }
            // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
            function generateSquareHtml(r, c) {
                let ele = cEle("span", {
                    class: "square",
                    style: `height:${squareRes};width:${squareRes}`,
                    r,
                    c,
                });
                return ele;
            }
            function generateRowHtml() {
                let ele = cEle("div", {
                    class: "row",
                    // style: `height:${squareRes};width:${squareRes}`,
                });
                return ele;
            }
        }
    }
    function reAlignCenter() {
        // l("call reAlignCenter");
        // if (!dragged) {
        let w = playGround.offsetWidth / 2,
            h = playGround.offsetHeight / 2,
            pW = window.innerWidth / 2,
            pH = window.innerHeight / 2;

        // let zoom =
        //     window.getComputedStyle(playGround).transform.split(",")[3] ||
        //     currentZoom;

        let zoom = 1;

        // l("zoom=", zoom);

        // anime({
        //     targets: playGround,
        //     translateX: pW - w,
        //     translateY: pH - h,
        //     duration: 0,
        // });
        playGround.style.transform = `translate(${pW - w}px,${pH - h}px)`;

        // playGround.style.transform = `translate(${pW - w}px,${
        //     pH - h
        // }px) scale(${typeof zoom == "string" ? zoom.trim() : zoom})`;

        // }
    }
    function setFullScreen() {
        $("#full-screen").onclick = function (e) {
            // $("#user").html(
            //     `${JSON.stringify(
            //         Boolean(
            //             document.fullscreenElement ||
            //                 document.webkitFullscreenElement ||
            //                 document.mozFullScreenElement
            //         )
            //     )}`
            // );

            if (isFullScreen()) {
                // Currently in fullscreen
                document.exitFullscreen();
            } else {
                document.body.requestFullscreen();
            }
            // if (this.hasCl("active")) {
            // } else {
            // }
        };
        document.addEventListener("fullscreenchange", (e) => {
            if (isFullScreen()) {
                $("#full-screen").addCl("active");
            } else {
                $("#full-screen").removeCl("active");
            }
        });
    }

    function initUser() {
        const userName = $("#user-name");

        let _min = 1,
            _max = 2;

        let current = 1;
        let users = {
            1: {
                name: "Người chơi 1",
            },
            2: { name: "Người chơi 2" },
        };
        const updateCurrent = () => {
            current = current > _max ? _min : current;
            current = current < _min ? _max : current;
        };
        return {
            getCurrent() {
                return current;
            },
            getCurrentUser() {
                return users[current].name;
            },
            nextUser() {
                current++;
                updateCurrent();
                this.updateDOM();
            },
            prevUser() {
                current--;
                updateCurrent();
                this.updateDOM();
            },
            editFirstUser(name = "") {
                users[1].name = name;
            },
            editSecondUser(name = "") {
                users[2].name = name;
            },
            updateDOM() {
                userName.innerText = this.getCurrentUser();
            },
        };
    }

    function unload() {
        window.onbeforeunload = () => "";
    }
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const root = $("#root");
const playGround = $("#playGround");
if (playGround) {
    run();
}
