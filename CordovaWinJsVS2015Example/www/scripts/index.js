// For info empty model view:
// http://go.microsoft.com/fwlink/?LinkID=397704

(function () {
	"use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
    	// pause/resume Cordova
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

    	//check network connection at start
        MyClass.ctrlConnection();
	};

    function onPause() {
    };

    function onResume() {
    };

    WinJS.UI.processAll().done(function () {

    	var splitView = document.querySelector(".splitView").winControl;
    	new WinJS.UI._WinKeyboard(splitView.paneElement); // Temporary workaround: Draw keyboard focus visuals on NavBarCommands

    	WinJS.UI.enableAnimations();

    	WinJS.Navigation.addEventListener("navigating", function (e) {
    		var elem = document.getElementById("pagesContainerDiv");

			//animation for exit page (see sub-pages for enter animation)
    		WinJS.UI.Animation.exitPage(elem.children).then(function () {
    			WinJS.Utilities.empty(elem);
    			WinJS.UI.Pages.render(e.detail.location, elem)
					.then(function () {
					});
    		});
    	});

    	//load home sub-page at start
    	WinJS.Navigation.navigate("./pages/nav_home/nav_home.html").done(function () {
    	});

    	var obj_cmdHome = document.querySelector('#cmdHome');
    	obj_cmdHome.addEventListener('click', function () {
    		WinJS.Navigation.navigate("./pages/nav_home/nav_home.html");
    		splitView.closePane();
    	}, false);

    	var obj_cmdInfo = document.querySelector('#cmdSettings');
    	obj_cmdInfo.addEventListener('click', function () {
    		if (WinJS.Navigation.location != "./pages/nav_settings/nav_settings.html") {//avoid reload same sub-page on click
    			WinJS.Navigation.navigate("./pages/nav_settings/nav_settings.html"); //load sub-page
    		}
    		splitView.closePane();
    	}, false);

    	var obj_cmdInfo = document.querySelector('#cmdHelp');
    	obj_cmdInfo.addEventListener('click', function () {
    		if (WinJS.Navigation.location != "./pages/nav_help/nav_help.html") {//avoid reload same sub-page on click
    			WinJS.Navigation.navigate("./pages/nav_help/nav_help.html"); //load sub-page
    		}
    		splitView.closePane();
    	}, false);

    });

})();

var MyClass = {};
(function () {

	this.readItem = function (keyinput) {

		if (typeof (Storage) !== "undefined") {
			return window.localStorage.getItem(keyinput);
		} else {
			return "Error"; //Storage is not supported on this device
		}

	};

	this.saveItem = function (keyinput, valinput) {

		if (typeof (Storage) !== "undefined") {
			window.localStorage.setItem(keyinput, valinput);
		} else {
			this.naviteAlert('Error'); //Storage is not supported on this device
		}

	};

	this.naviteAlert = function (messaggio) {
		navigator.notification.alert(
			messaggio, //message
			this.onConfirm,
			'Notice', //title
			'OK'
		);
	};

	onConfirm = function (button) {
		//navigator.notification.confirm(button,yourfunction);
	};

	this.ctrlConnection = function () {
		var networkState = navigator.network.connection.type;

		if (networkState == Connection.NONE) {
			this.naviteAlert('Network unavailable. Check your Internet connection.');
		}
	};

	//handle the back button
	this.onBackKeyDown = function (args) {
		if (WinJS.Navigation.canGoBack == true) {
			WinJS.Navigation.back(1).done( /* Your success and error handlers */);
		}
	};

	var lastSplitViewCommandPressed;

	//keep press effect button for splitview
	this.hoverSplitView = function (idCommand) {
		if (lastSplitViewCommandPressed != null) {
			WinJS.Utilities.removeClass(document.getElementById(lastSplitViewCommandPressed), 'SplitViewCommand-hover');
		}

		WinJS.Utilities.addClass(document.getElementById(idCommand), 'SplitViewCommand-hover');

		lastSplitViewCommandPressed = idCommand;
	};

}).apply(MyClass);
