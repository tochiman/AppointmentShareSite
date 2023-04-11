package model

type Calendar struct{
	Id 				int64  `form:"id" db:"id" binding:"required" json:"id"`
	Start 			string `form:"start" db:"start" binding:"required" json:"start"`
	End 			string `form:"end" db:"end" binding:"required" json:"end"`
	Title 			string `form:"title" db:"title" binding:"required" json:"title"`
	Location 		string `form:"location" db:"location" json:"location"`
	Description 	string `form:"description" db:"description" json:"description"`
	User			string `form:"user" db:"user" binding:"required" json:"user"`
}