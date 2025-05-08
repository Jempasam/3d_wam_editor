

export class SharedGainAnalyzer{

    private analyzer

    constructor(
        private source: AudioNode
    ){
        this.analyzer = source.context.createAnalyser()
        this.source.connect(this.analyzer)
    }

    dispose(){
        this.source.disconnect(this.analyzer)
    }
}