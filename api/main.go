package main

import (
	"api/controller"
	"api/middleware"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"time"
	"github.com/gin-contrib/cors"
)

func main() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		// アクセスを許可したいアクセス元
		AllowOrigins: []string{
			"http://localhost:3000",
			"*",
		},
		// アクセスを許可したいHTTPメソッド(以下の例だとPUTやDELETEはアクセスできません)
		AllowMethods: []string{
			"POST",
			"GET",
			"PUT",
			"DELETE",
		},
		// 許可したいHTTPリクエストヘッダ
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
		},
		// preflightリクエストの結果をキャッシュする時間
		MaxAge: 24 * time.Hour,
	}))

	router.Use(middleware.RecordUaAndTime)
	apipath := router.Group("/api")
	v1path := apipath.Group("/v1")
	userpath := v1path.Group("/user")
	{
		userpath.GET("/info", controller.GetUserInformation)
		userpath.POST("/create", controller.AddUserInformation)
		userpath.DELETE("/delete", controller.DeleteUserInformation)
		userpath.PUT("/update", controller.UpdateUserInformation)
	}
	tokenpath := v1path.Group("token")
	{
		tokenpath.GET("/get", controller.GetToken)
		tokenpath.POST("/create", controller.AddToken)
		tokenpath.DELETE("/delete", controller.DeleteToken)
	}
	// calendarpath := v1path.Group("/calendar")
	// {
		// 	calendarpath.POST("/add", controller.AddCalendar)
		// 	calendarpath.GET("/get", controller.GetCalendar)
		// 	calendarpath.DELETE("/delete", controller.DeleteCalendar)
		// 	calendarpath.PUT("/update", controller.UpdateCalendar)
	// }
	router.Run()
}
