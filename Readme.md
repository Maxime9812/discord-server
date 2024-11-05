# Discord server

lien vers la doc de l'api: [http://localhost:3000/doc](http://localhost:3000/doc)

## Notifications en temps réel

La route /notifications permet de recevoir des notifications en temps réel.

Le serveur utilies le principe de SSE (Server Sent Events) pour envoyer des notifications en temps réel.

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

Pour ecouter les notifications, il suffit de se connecter à la route /notifications avec un client SSE.

Exemple en typescript:
``` typescript
// withCredentials permet de transmettre les cookies
const eventSource = new EventSource('http://localhost:3000/notifications', { withCredentials: true });

eventSource.addEventListener('message-received', (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
});

eventSource.addEventListener('friend-request-received', (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
});

// pour fermer la connexion
eventSource.close()
```

