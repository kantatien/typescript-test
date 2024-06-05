interface Board {
    ladders: [number, number][];
    snakes: [number, number][];
}

function getClockAngle(hh_mm: string): number {

    const [hour, minute] = hh_mm.split(':').map(Number);
    const angle = Math.abs(30 * (hour % 12) - (11 / 2) * minute);
    const clockAngle = Math.min(angle, 360 - angle);
    return clockAngle;
}

function getQuestionPart(phrases: string[]): string[] {

    const word = phrases[0];
    let questionPart = "";

    for (let i = 0; i < word.length; i++) {

        if (word[i] && phrases.every((phrase: any) => phrase.includes(word[i]))) {
            questionPart += word[i];
        } else {
            break;
        }
    }

    const result = phrases.map((phrase: any) => phrase.replace(questionPart, "").trim());
    return result
}

function quickestPath(board: { ladders: [number, number][]; snakes: [number, number][]; }): number[] {
    const target = 100;
    const boardArray = Board(board);

    const visited = Array(101).fill(false);
    const queue: [number, number[]][] = [[1, []]];
    let move = 0;
    while (queue.length > 0) {

        const [position, path] = queue.shift()!;
        if (position === target) {
            return path;
        }
        if (!visited[position]) {
            visited[position] = true;

            for (let i = 1; i <= 6; i++) {
                const nextPosition = position + i;

                if (nextPosition <= target) {
                    const nextPositionWithSnakeOrLadder = boardArray[nextPosition];
                    const newPath = [...path, i];

                    if (nextPositionWithSnakeOrLadder !== -1) {
                        queue.push([nextPositionWithSnakeOrLadder, newPath]);
                    } else {
                        queue.push([nextPosition, newPath]);
                    }
                }
            }
        }
        move++;
    }

    return []

}

function Board(board: Board): number[] {
    const result = Array(101).fill(-1);

    for (const [start, end] of board.ladders) {
        result[start] = end;
    }

    for (const [start, end] of board.snakes) {
        result[start] = end;
    }

    return result;
}

function minEnergy(start: number, shops: number[], stations: number[], target: number): number {
    let energy = 0;

    if (shops.find(item => item === start)) {
        shops.splice(shops.indexOf(start), 1);
    }

    if ((target > stations[stations.length - 1]) && (shops.find(item => item > stations[stations.length - 1])) && (target > shops[shops.length - 1])) {
        const indicesToRemove: number[] = [];
        shops.forEach((item, index) => {
            if (item > stations[stations.length - 1]) {
                indicesToRemove.push(index);
            }
        });

        indicesToRemove.reverse().forEach(index => {
            shops.splice(index, 1);
        });

    }

    if ((target < stations[0]) && (shops.find(item => item < stations[0])) && (target < shops[0])) {
        const indicesToRemove: number[] = [];
        shops.forEach((item, index) => {
            if (item < stations[0]) {
                indicesToRemove.push(index);
            }
        });

        indicesToRemove.reverse().forEach(index => {
            shops.splice(index, 1);
        });

    }

    while ((Math.abs(start - target) !== 0) || (shops.length !== 0)) {
        while (shops.length !== 0) {
            const compare1 = shops.map(item => Math.abs(item - start));
            const compare2 = stations.map(item => Math.abs(item - start));
            const min1 = Math.min(...compare1);
            const min2 = Math.min(...compare2);
            const index2 = compare2.indexOf(min2);

            if (min1 <= min2) {
                energy += min1;
                for (let i = 0; i < shops.length; i++) {
                    if (Math.abs(start - min1) === shops[i] || Math.abs(start + min1) === shops[i]) {
                        start = shops[i];
                        shops.splice(i, 1);
                        break;
                    }
                }
            } else {
                const distances: number[][] = [];
                for (let i = 0; i < compare1.length; i++) {
                    const distance: number[] = [];
                    for (let j = 0; j < compare2.length; j++) {
                        distance.push(Math.abs(compare1[i] - compare2[j]));
                    }
                    distances.push(distance);
                }

                let lowest = Number.MAX_SAFE_INTEGER;
                let index1 = Number.MAX_SAFE_INTEGER;

                for (let i = 0; i < distances.length; i++) {
                    const minDistance = Math.min(...distances[i]);
                    if (minDistance < lowest) {
                        lowest = minDistance;
                        index1 = distances[i].indexOf(minDistance);
                    }
                }

                energy += Math.abs(stations[index2] - start) + lowest;
                const check1 = Math.abs(stations[index1] - lowest);
                const check2 = Math.abs(stations[index1] + lowest);
                if (lowest === 0) {
                    if (min2 === 0) {
                        let diag_line = Number.MAX_SAFE_INTEGER;
                        let diag_index = Number.MAX_SAFE_INTEGER;
                        for (let i = 0; i < shops.length; i++) {
                            if (distances[i][i] < diag_line) {
                                diag_line = distances[i][i];
                                diag_index = i;
                                start = shops[diag_index];
                                energy = energy + diag_line;
                            }
                        }
                    } else {
                        if (shops.find(item => item === check1 || item === check2) !== undefined) {
                            start = shops.find(item => item === check1 || item === check2) || start;
                            shops.splice(shops.indexOf(start), 1);
                        } else {
                            let diag_line: number = Number.MAX_SAFE_INTEGER;
                            let diag_index: number = Number.MAX_SAFE_INTEGER;
                            for (let i = 0; i < shops.length; i++) {
                                if (distances[i][i] < diag_line) {
                                    diag_line = distances[i][i];
                                    diag_index = i;
                                    start = shops[diag_index];
                                    shops.splice(shops.indexOf(start), 1);
                                }
                            }
                        }
                    }
                } else {

                    if (shops.find(item => item === check1 || item === check2) !== undefined) {
                        start = shops.find(item => item === check1 || item === check2) || start;
                        shops.splice(shops.indexOf(start), 1);
                    } else {
                        let diag_line: number = Number.MAX_SAFE_INTEGER;
                        let diag_index: number = Number.MAX_SAFE_INTEGER;
                        for (let i = 0; i < shops.length; i++) {
                            if (distances[i][i] < diag_line) {
                                diag_line = distances[i][i];
                                diag_index = i;
                                start = shops[diag_index];
                                shops.splice(shops.indexOf(start), 1);

                            }
                        }
                    }

                }
            }

        }

        const lastDistance = Math.abs(target - start);
        const lastCheck: number[] = stations.map(item => Math.abs(start - item));
        const lastCheck2: number[] = stations.map(item => Math.abs(target - item));
        const lastLowest = Math.min(...lastCheck);
        const lastLowest2 = Math.min(...lastCheck2);

        if (lastLowest + lastLowest2 <= lastDistance) {
            energy += lastLowest + lastLowest2;
            start = target;
        } else {
            energy += lastDistance;
            start = target;
        }
    }

    return energy;
}

export default {
    getClockAngle,
    getQuestionPart,
    quickestPath,
    minEnergy
};
