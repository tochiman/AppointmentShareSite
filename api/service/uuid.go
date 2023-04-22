package service

import (
	"fmt"
	"crypto/rand"
	"github.com/google/uuid"
    "encoding/base64"
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
func Generate_token(length int) string{
    bytes := make([]byte, length)
    rand.Read(bytes)
    return base64.URLEncoding.EncodeToString(bytes)
}