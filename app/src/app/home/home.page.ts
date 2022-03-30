import { Component, Renderer2, ViewChild } from '@angular/core';
import { AnimationController,Animation, Platform, Gesture, GestureController, GestureDetail } from '@ionic/angular';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('blocks')blocks:any;
  @ViewChild('background')background:any;
  @ViewChild('swipeDown')swipeDown:any;

  public options: Array<any> = [
    {  icon: 'person-add-outline', text:'Indicar amigos'},
    {  icon: 'phone-portrait-outline', text:'Recarga de celular'},
    {  icon: 'wallet-outline', text:'Depositar'},
    {  icon: 'options-add-outline', text:'Ajustar Limite'},
    {  icon: 'help-circle-outline', text:'Me ajuda'},
    {  icon: 'barcode-outline', text:'Pagar'},
    {  icon: 'lock-open-outline', text:'Bloquear Cartão'},
    {  icon: 'card-outline', text:'Cartão individual'}
  ];
  public items: Array<any> = [
    {  icon: 'help-circle-outline', text:'Me ajuda'},
    {  icon: 'person-outline', text:'Perfil'},
    {  icon: 'cash-outline', text:'Configurar Limite'},
    {  icon: 'card-outline', text:'Configurar Conta'},
    {  icon: 'phone-portrait-outline', text:'configurações do app'}
  ];

  public initialStep:number= 0;
  public maxTranslate:number;
  private animation: Animation;
  private gesture: Gesture;
  public swiping: boolean;
  

  public slideOptions:any ={ slidesPerView: 3.4 , freeMode:true };
   constructor(
     private animationCtrl: AnimationController,
     private platform: Platform,
     private renderer: Renderer2,
     private gestureCtrl: GestureController
   ) {
     this.maxTranslate= this.platform.height()- 200;
   }

  ngAfterViewInit(){
    this.createAnimation();
    this.detectSwipe();
    }

  detectSwipe(){
    this.gesture = this.gestureCtrl.create({
      el:this.swipeDown.el,
      gestureName:'swipe-down',
      threshold:0,
      onMove: ev => this.onMove(ev),
      onEnd: ev => this.onEnd(ev)
    },true);

    this.gesture.enable(true);
  }

  onMove(ev:GestureDetail){
    if(!this.swiping){
      this.animation.direction('normal').progressStart(true);
      this.swiping=true;
    }
    const step: number = this.getStep(ev);
    
    this.animation.progressStep(step);
    this.setBackgroundOpacity(step);
  }

  onEnd(ev:GestureDetail){
    if(!this.swiping) return ;

    this.gesture.enable(false);

    const step:number=this.getStep(ev);
    const shouldComplete:boolean =step>0.5;

    this.animation.progressEnd(shouldComplete ? 1 : 0,step);

    this.initialStep= shouldComplete ? this.maxTranslate : 0;

    this.setBackgroundOpacity();
    
    this.swiping = false; 
  }  
    
  getStep(ev:GestureDetail):number{
    const delta:number=this.initialStep+ev.deltaY;
    return delta/this.maxTranslate; 
  }

  createAnimation(){
    this.animation = this.animationCtrl.create()
    .addElement(this.blocks.nativeElement)
    .duration(300)
    .fromTo('transform','translateY(0)',`translateY(${this.maxTranslate}px)`)
    .onFinish( () => this.gesture.enable(true));
  }

  toogleBlocks(){
    this.initialStep= this.initialStep === 0 ? this.maxTranslate : 0;

    this.gesture.enable(false);

    this.animation.direction(this.initialStep === 0 ? 'reverse' : 'normal').play();
    
    this.setBackgroundOpacity();
  }
  setBackgroundOpacity(value:number = null){
     this.renderer.setStyle(this.background.nativeElement,'opacity',this.initialStep === 0 ?'0':'1');
  }
  fixedBlocks():boolean{
    return this.initialStep === this.maxTranslate; 
  }
}
