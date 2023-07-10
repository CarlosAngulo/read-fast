import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject,interval } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  text = `En los últimos años del siglo diecinueve nadie habría creído que los asuntos humanos eran observados aguda y atentamente por inteligencias más desarrolladas que la del hombre y, sin embargo, tan mortales como él; que mientras los hombres se ocupaban de sus cosas eran estudiados quizá tan a fondo como el sabio estudia a través del microscopio las pasajeras criaturas que se agitan y multiplican en una gota de agua. Con infinita complacencia, la raza humana continuaba sus ocupaciones sobre este globo, abrigando la ilusión de su superioridad sobre la materia. Es muy posible que los infusorios que se hallan bajo el microscopio hagan lo mismo. Nadie supuso que los mundos más viejos del espacio fueran fuentes de peligro para nosotros, o si pensó en ellos, fue sólo para desechar como imposible o improbable la idea de que pudieran estar habitados. Resulta curioso recordar algunos de los hábitos mentales de aquellos días pasados. En caso de tener en cuenta algo así, lo más que suponíamos era que tal vez hubiera en Marte seres quizá inferiores a nosotros y que estarían dispuestos a recibir de buen grado una expedición enviada desde aquí. Empero, desde otro punto del espacio, intelectos fríos y calculadores y mentes que son en relación con las nuestras lo que éstas son para las de las bestias, observaban la Tierra con ojos envidiosos mientras formaban con lentitud sus planes contra nuestra raza. Y a comienzos del siglo veinte tuvimos la gran desilusión.
  
  Casi no necesito recordar al lector que el planeta Marte gira alrededor del Sol a una distancia de ciento cuarenta millones de millas y que recibe del astro rey apenas la mitad de la luz y el calor que llegan a la Tierra. Si es que hay algo de verdad en la hipótesis corriente sobre la formación del sistema planetario, debe ser mucho más antiguo que nuestro mundo, y la vida nació en él mucho antes que nuestro planeta se solidificara. El hecho de que tiene apenas una séptima parte del volumen de la Tierra debe haber acelerado su enfriamiento, dándole una temperatura que permitiera la aparición de la vida sobre su superficie. Tiene aire y agua, así como también todo lo necesario para sostener la existencia de seres animados.`;

  textArr: string[] = [];
  currentText = '';
  currentIndex = 0;
  ppm = 200;
  private destroy$ = new BehaviorSubject(true);
  running = true;
  
  private speed$ = new BehaviorSubject<number>(60000 / this.ppm);
  
  currentTime = 0;

  ngOnInit(): void {
    const parsedText = this.parseText(this.text);
    this.speed$.pipe(
      switchMap(speed => interval(speed)),
      map(() => this.currentTime++),
      filter(() => this.running && this.currentIndex < parsedText.length),
    )
    .subscribe(() => {
      if (parsedText[this.currentIndex + 1] && parsedText[this.currentIndex].length + parsedText[this.currentIndex + 1].length < 6) {
        this.currentText = `${parsedText[this.currentIndex]}&nbsp;&nbsp;${parsedText[this.currentIndex + 1]}`;
        this.currentIndex += 2;
      } else {
        this.currentText = parsedText[this.currentIndex];
        this.currentIndex++;
      }
    });
  }

  parseText(text:string): string[] {
    return text
    .replace(/\.\s/g, ".    ")
    .replace(/\,\s/g, ",   ")
    .replace(/\;\s/g, ";  ")
    .split(' ');
  }

  pauseInterval() {
    this.running = false;
  }
  
  resumeInterval() {
    this.running = true;
  }

  restart() {
    this.currentIndex = 0;
    this.currentText = '';
  }

  increaseSpeed() {
    this.ppm += 25;
    this.speed$.next(60000 / this.ppm);
  }

  decreaseSpeed() {
    this.ppm -= 25;
    this.speed$.next(60000 / this.ppm);
  }

  ngOnDestroy() {
    this.destroy$.next(false);
    this.destroy$.complete();
  }
}
