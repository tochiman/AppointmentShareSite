package model

type Token struct{
	Id		string	`form:"id" db:"id" binding:"required" json:"id"`
	Token	string	`form:"token" db:"token" json:"token"`
}