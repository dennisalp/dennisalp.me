# Scrollable 3D Animation with Three.js

- Basically everything is copied from [Jeff Delaney](https://github.com/fireship-io/threejs-scroll-animation-demo).
- Watch the [full tutorial](https://youtu.be/Q7AOvWpIVHU) on YouTube

## Usage

```
git clone <this-repo>
npm install
npm run dev
```

## Re-deploy
```
./deploy.sh "commit message"
```

## scp issues
`scp` has [major serious issues after a patch](https://superuser.com/questions/1403473/scp-error-unexpected-filename), so just use `rsync` instead.

## ssh issues
These can magically solve ssh issues
```
rm /.ssh/id_rsa
rm /.ssh/id_rsa.pub
```
Also, clearing `~/.ssh/known_hosts` may help.

## Manage Files
File manager at [cPanel](https://server330.web-hosting.com:2083/)

Username: `dennpaew`
