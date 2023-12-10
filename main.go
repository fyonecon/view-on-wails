package main

import (
	"changeme/bootstrap"
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	// 编译前的初始化操作
	bootstrap.AppInit()

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:             "",
		Width:             1150,
		Height:            720,
		MinWidth:          320,
		MinHeight:         420,
		HideWindowOnClose: true,
		Frameless:         false,
		WindowStartState:  options.Normal,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 51, G: 51, B: 51, A: 229}, // A最大255，取90%
		OnStartup:        app.startup,
		CSSDragProperty:  "--wails-draggable",
		CSSDragValue:     "drag",
		Bind: []interface{}{
			app,
		},
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: false,
				HideTitle:                  false, //
				HideTitleBar:               false, // 三个点
				FullSizeContent:            false,
				UseToolbar:                 false,
				HideToolbarSeparator:       true,
			},
			Appearance:           mac.NSAppearanceNameDarkAqua,
			WebviewIsTransparent: true,
			WindowIsTranslucent:  false,
			About: &mac.AboutInfo{
				Title:   "简单主页（PureHome）v2.4.0",
				Message: "©fyonecon；Using Wails2.6.0、viewJS。",
				//Icon:    icon,
			},
		},
		Windows: &windows.Options{
			WebviewIsTransparent:              false,
			WindowIsTranslucent:               false,
			BackdropType:                      windows.Mica,
			DisableWindowIcon:                 false,
			DisableFramelessWindowDecorations: false,
			WebviewUserDataPath:               "",
			WebviewBrowserPath:                "",
			Theme:                             windows.SystemDefault,
			CustomTheme: &windows.ThemeSettings{
				DarkModeTitleBar:   windows.RGB(20, 20, 20),
				DarkModeTitleText:  windows.RGB(200, 200, 200),
				DarkModeBorder:     windows.RGB(20, 0, 20),
				LightModeTitleBar:  windows.RGB(200, 200, 200),
				LightModeTitleText: windows.RGB(20, 20, 20),
				LightModeBorder:    windows.RGB(200, 200, 200),
			},
			// User messages that can be customised
			//Messages *windows.Messages
			// OnSuspend is called when Windows enters low power mode
			//OnSuspend func()
			// OnResume is called when Windows resumes from low power mode
			//OnResume func(),
			//WebviewGpuDisabled: false,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
