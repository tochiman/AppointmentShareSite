package service

import (
	"api/model"
	"log"
)

type IdService struct{
	
}

func (IdService) GetToken(id string) []model.Token{
	db := connectDB()
	defer db.Close()

	rows, err := db.Queryx("SELECT * FROM token WHERE id =?", id)
	if err != nil {
		panic(err)
	}
	results := make([]model.Token, 0)
	for rows.Next() {
		var token model.Token

		err = rows.StructScan(&token)
		if err != nil {
            log.Fatal(err)
        }
		results = append(results, token)
	}
	return results
}

func (IdService) AddToken(token *model.Token) error {
	db := connectDB()
	defer db.Close()
	var err error
	token.Token = Generate_token(210) 
	_, err = db.NamedExec(
		"INSERT INTO token (id, token) VALUES(:id,:token)",token)
	if err != nil {
		return err
	}

	return nil
}

// func (IdService) DeleteToken(id string)error{
// 	db := connectDB()
// 	defer db.Close()

// 	_, err := db.Exec("DELETE FROM token WHERE id IN(SELECT id FROM token WHERE token=?)", token)
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }