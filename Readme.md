# Discord server

lien vers la doc de l'api: [http://localhost:3000/doc](http://localhost:3000/doc)

## Notifications en temps réel

La route /notifications permet de recevoir des notifications en temps réel.

le serveur envoie 3 evenements:
- `friend-request-received` : lorsqu'une demande d'ami est reçue
``` typescript
{
    "data": {
        "userId": "c910ad8d-b8d5-4c7a-ab18-1c08c99790da"
    }
}
```
- `friend-request-accepted` : lorsqu'une demande d'ami est acceptée
``` typescript
{
    "data": {
        "id": "c910ad8d-b8d5-4c7a-ab18-1c08c99790da",
        "senderId": "c910ad8d-b8d5-4c7a-ab18-1c08c99790da",
        "requestedAt": "2021-06-01T12:00:00.000Z"
    }
}
```
- `message-received` : lorsqu'un message est reçu
``` typescript
{
    "data": {
        "id": "c910ad8d-b8d5-4c7a-ab18-1c08c99790da",
        "emitterId": "c910ad8d-b8d5-4c7a-ab18-1c08c99790da",
        "content": "Hello",
        "sendAt": "2021-06-01T12:00:00.000Z"
    }
}
```
