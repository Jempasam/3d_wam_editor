

export class SharedGainAnalyzer{

    private analyzer

    get node(){ return this.analyzer }

    constructor(
        private source: AudioNode
    ){
        this.analyzer = source.context.createAnalyser()
        this.analyzer.fftSize = 32
        this.source.connect(this.analyzer)
    }

    dispose(){
        this.source.disconnect(this.analyzer)
    }
}