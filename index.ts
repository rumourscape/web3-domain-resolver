import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ethers } from "ethers";

dotenv.config();

const network = "homestead"
const provider = ethers.getDefaultProvider(network,{ etherscan: process.env.ETHERSCAN_KEY })

const app: Express = express();
const port = process.env.PORT;

app.get('/domain/:domain', async (req: Request, res: Response) => {
  
  const obj = await get_domain(req.params.domain)
  res.send(obj);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

async function get_domain(domain:string) {
  var obj= {
    blockchain: "",
    address: "",
    avatar: "",
    contentHash: "",
    email: ""
  }

  const tld = domain.split('.')[1]

  if(tld=="eth") {
    const resolver = await provider.getResolver(domain);
  
    if (resolver) {
      obj.blockchain = "ethereum";
      obj.address = resolver.address;

      const contentHash = await resolver.getContentHash();
      if(contentHash) { obj.contentHash=contentHash }
      
      const email = await resolver.getText("email");
      if(email) { obj.email=email }

      const avatar = await resolver.getAvatar();
      if(avatar) { obj.avatar=avatar }

    }
  }

  return obj
}