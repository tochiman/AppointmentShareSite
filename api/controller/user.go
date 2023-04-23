package controller

import (
	"api/model"
	"api/service"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUserInformation(c *gin.Context) {
	getEmail := c.Query("email")
	getEmail = c.DefaultQuery("email", "None")
	if getEmail == "None" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": "400 Bad Request",
			"content": "Email is required",
		})
		return
	}

	userService := service.UserService{}
	getData := userService.GetUserInformation(getEmail)
	if len(getData) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "none",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"result": getData,
		})
	}
}

func AddUserInformation(c *gin.Context) {
	var userModel model.User

	err := c.Bind(&userModel)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": err.Error(),
		})
		return
	}
	userService := service.UserService{}
	err = userService.AddUserInformation(&userModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
            "content": err.Error(),
		})
	} else {
		c.JSON(http.StatusCreated, gin.H{
			"status": "ok",
			"data":   userModel,
		})
	}
}

func DeleteUserInformation(c *gin.Context) {
	token := c.GetHeader("token")

	calendarService := service.UserService{}
	err := calendarService.DeleteUserInformation(token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
            "content": err.Error(),
        })
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

func UpdateUserInformation(c *gin.Context) {
	var userModel model.User
	err := c.Bind(&userModel)
	if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "status":  "400 Bad Request",
            "content": err.Error(),
        })
		return
	}
	token := c.GetHeader("token")
	fmt.Println(token)
	calendarService := service.UserService{}
	err = calendarService.UpdateUserInformation(&userModel, token)
	if err!= nil {
		c.JSON(http.StatusInternalServerError, gin.H{
            "status":  "500 Internal Server Error",
            "content": err.Error(),
        })
        return
    }
	c.JSON(http.StatusNoContent, gin.H{
		"status": "ok",
	})
}
