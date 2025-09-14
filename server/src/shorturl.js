import { ExpressApp } from './utilis/express.js';
import { PostLongUrls } from './post-handler/post-long-urls.js';
import { GetLongUrls } from './get-handler/get-long-urls.js';
import { GetMetaData } from './get-handler/get-stats.js';
import {DeleteShortUrl} from './delete-handler/delete-short-url.js'
import { UpdateExpiry } from './update-handler/update-expiry.js';
import {Authorization} from './post-handler/Authorization.js'
import { GetUrlsList } from './get-handler/get-all-long-urls.js';
import 'dotenv/config'
import {authenticateJWT} from './utilis/auth-middleware.js'

const port = process.env.PORT
export class ShortUrl {
    constructor() {
        // Initialize Express app and apply initial routes
        this.app = new ExpressApp(port, this.initApps).getApp();
    }

    reInitApp() {
        // Reinitialize app and reapply routes
        this.app = new ExpressApp(port, this.initApps).getApp();
        this.initApps(this.app);
    }

    initApps = (app) => {
        this.postLongUrls = new PostLongUrls();
        this.getLongUrls = new GetLongUrls();
        this.getMetadata = new GetMetaData();
        this.deleteShortUrl = new DeleteShortUrl()
        this.updateExpiry = new UpdateExpiry()
        this.authorize = new Authorization()
        this.allUrls = new GetUrlsList()
        

        // Define routes
        app.post('/login',this.authorize.getToken)
        app.post('/shorturl',authenticateJWT, this.postLongUrls.convertToShortUrl);
        app.get('/urls',authenticateJWT,this.allUrls.getUrls)
        app.get('/:shortCode',this.getLongUrls.getUrls);
        app.get('/stats/:shortCode',authenticateJWT,this.getMetadata.getMetaInfo)
        app.delete('/delete/:shortCode',authenticateJWT,this.deleteShortUrl.deleteUrl)
        app.put('/update/expiry/:shortCode',authenticateJWT,this.updateExpiry.update)
       
    };
 }
