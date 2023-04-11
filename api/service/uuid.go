package service

import (
	"fmt"
	"crypto/rand"
    "errors"
	"github.com/google/uuid"
)

func Generate_uuid() string{
	u, err := uuid.NewUUID()
	if err != nil {
			fmt.Println(err)
			return ""
	}
	uu := u.String()
	
	return uu
}


//Token生成用の関数。ランダムな文字列を返却
func Generate_token(digit uint32) (string, error){
	const letters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	
    b := make([]byte, digit)
	_, err := rand.Read(b)
    if err != nil {
		return "", errors.New("unexpected error...")
    }
	
    var res string
    for _, v := range b {
        res += string(letters[int(v)%len(letters)])
    }
    return res, nil
}