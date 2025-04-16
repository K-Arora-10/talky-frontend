class PeerService{
    constructor(){
        if(!this.PeerService){
            this.peer = new RTCPeerConnection({
                
                    iceServers: [
                      {
                        urls: [
                          "stun:ss-turn1.xirsys.com",
                          "turn:ss-turn1.xirsys.com:80?transport=udp",
                          "turn:ss-turn1.xirsys.com:3478?transport=udp",
                          "turn:ss-turn1.xirsys.com:80?transport=tcp",
                          "turn:ss-turn1.xirsys.com:3478?transport=tcp",
                          "turns:ss-turn1.xirsys.com:443?transport=tcp",
                          "turns:ss-turn1.xirsys.com:5349?transport=tcp"
                        ],
                        username: "D7AwCeqPVw9G7UY76GbYHFKTW7qX2ZYd2BJ8585ZkvX4GzTrzQFKT915teKL_vkkAAAAAGf_oIJrcmlzaGFyb3Jh",
                        credential: "2910c3de-1abd-11f0-a90f-0242ac140004"
                      }
                    ]
                })
        }
    }


    async getAnswer(offer)
    {
        if(this.peer)
        {
            await this.peer.setRemoteDescription(offer)
            const ans = await this.peer.createAnswer()
            await this.peer.setLocalDescription(new RTCSessionDescription(ans))
            return ans
        }
    }


    async setLocalDescription(ans){
        if(this.peer){
            await this.peer.setRemoteDescription(ans)
        }
    }


    async getOffer()
    {
        if(this.peer)
        {
            const offer = await this.peer.createOffer()
            await this.peer.setLocalDescription(new RTCSessionDescription(offer))
            return offer
        }
        
    }
}

export default new PeerService()