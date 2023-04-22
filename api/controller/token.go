package controller

import (
	"api/model"
	"api/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetToken(c *gin.Context) {
	getId := c.Query("id")
	getId = c.DefaultQuery("id", "None")
	if getId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
            "content": "id is empty",
        })
        return
    }

	tokenService := service.IdService{}
	getData := tokenService.GetToken(getId)
	if len(getData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
            "content": "token is empty",
        })
    } else{
		c.JSON(http.StatusOK, gin.H{
			"status":  "200 OK",
			"content": gin.H{"token": getData},
		})
	}
}

func AddToken(c *gin.Context) {
	var tokenModel model.Token

	err := c.Bind(&tokenModel)
	if err!= nil {
		c.JSON(http.StatusBadRequest, gin.H{
            "status":  "400 Bad Request",
            "content": err.Error(),
        })
        return
    }

	tokenService := service.IdService{}
	err = tokenService.AddToken(&tokenModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
            "status":  "500 Server Internal Error",
            "content": err.Error(),
        })
        return
	} else {
		c.JSON(http.StatusOK, gin.H{
            "status":  "200 OK",
            "content": gin.H{"token": tokenModel.Token},
        })
	}
}

func DeleteToken(c *gin.Context){
	var tokenModel model.Token

	err := c.Bind(&tokenModel)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
            "status":  "400 Bad Request",
            "content": err.Error(),
        })
        return
    }
	tokenService := service.IdService{}
	err = tokenService.DeleteToken(&tokenModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
            "status":  "500 Server Internal Error",
            "content": err.Error(),
        })
        return
	} else {
		c.JSON(http.StatusOK, gin.H{
            "status":  "200 OK",
        })
	}
}
