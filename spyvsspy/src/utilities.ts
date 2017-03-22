export module Utilities {
    export function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    export function generateGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    export function getOppositeDirection(direction: string){
        switch(direction){
            case 'N':
                return 'S';
            case 'S':
                return 'N';
            case 'W':
                return 'E';
            case 'E':
                return 'W';
            default: 
                return 'Unkown';
        }
    }
}