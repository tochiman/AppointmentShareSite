package model

type User struct{
	Id			string	`form:"id" db:"id" json:"id"`
	Username	string	`form:"username" db:"username" binding:"required" json:"username"`
	Password	string	`form:"password" db:"password" json:"password"`
	Email		string	`form:"email" db:"email" binding:"required" json:"email"`
	Image		string	`form:"image" db:"image" json:"image"`
}