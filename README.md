# WEB3-DOMAIN-RESOLVER

Resolves blockchain domain names to address and other details. Supports ETH,BNB,SOL,APT.

## SETUP
Clone this repo to your desktop and run ```npm install``` to install all the dependencies.
</br>
Create a ```.env``` file in the following format:
```.env
PORT=3000
ETHERSCAN_KEY=YOUR_ETHERSCAN_API_KEY
```

## USAGE
Run ```npm start``` to initialize the server.
</br>
Resolve domain name via the following URL:
```url
http://localhost:3000/domain/<DOMAIN_NAME>
```

## RESPONSE FORMAT
The server will return a valid response with the following JSON:
```JSON
{
    blockchain: "",
    address: "",
    avatar: "",
    contentHash: "",
    email: ""
}
```