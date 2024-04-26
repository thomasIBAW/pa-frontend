# Projektarbeit Frontend

    The complete README will follow. 



### Socket.io
Using socket.io to update items in real time for all clients (Add, .... )

Every client joins a room corrisponding to his familyId. This allows the server to only emit and update family related clients.
Socket.io is not emitting any data related to the modified data. Socket.io is exclusively used to trigger a rerender on the connected clients.