"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ethers_1 = require("ethers");
const spl_name_service_1 = require("@bonfida/spl-name-service");
dotenv_1.default.config();
const network = "homestead";
const provider = ethers_1.ethers.getDefaultProvider(network, { etherscan: process.env.ETHERSCAN_KEY });
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get('/domain/:domain', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = yield get_domain(req.params.domain);
    res.send(obj);
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
function get_domain(domain) {
    return __awaiter(this, void 0, void 0, function* () {
        var obj = {
            blockchain: "",
            address: "",
            avatar: "",
            contentHash: "",
            email: ""
        };
        const tld = domain.split('.')[1];
        if (tld == "eth") {
            const resolver = yield provider.getResolver(domain);
            if (resolver) {
                obj.blockchain = "ethereum";
                obj.address = resolver.address;
                const contentHash = yield resolver.getContentHash();
                if (contentHash) {
                    obj.contentHash = contentHash;
                }
                const email = yield resolver.getText("email");
                if (email) {
                    obj.email = email;
                }
                const avatar = yield resolver.getAvatar();
                if (avatar) {
                    obj.avatar = avatar;
                }
            }
        }
        else if (tld == "bnb") {
            const response = yield fetch(`https://api.prd.space.id/v1/getAddress?tld=bnb&domain=${domain}`);
            obj.blockchain = "bnb";
            obj.address = (yield response.json())['address'];
        }
        else if (tld == "apt") {
            const response = yield fetch(`https://www.aptosnames.com/api/mainnet/v1/address/${domain}`);
            obj.address = (yield response.json())['address'];
            obj.blockchain = "aptos";
        }
        else if (tld == "sol") {
            obj.address = (0, spl_name_service_1.getDomainKeySync)(domain)['pubkey'].toString();
            obj.blockchain = "solana";
        }
        return obj;
    });
}
