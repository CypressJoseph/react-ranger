import { v4 as uuid } from 'uuid';

type Step<T> = {
    id: string
    data: T
    depth: number
    label: string
}

const nullStep: Step<null> = { id: 'null:Step', data: null, depth: -1, label: 'no' }

type Tree<T> = {
    id: string
    data?: T
    children: Tree<T>[]
}

// type Plan<T> = Step<T>[]

class PlanInspector<T> {
    constructor(private root: Tree<T> = { id: uuid(), children: [] }) { }

    traverse<PlanStep extends Step<T>>(planLiteral: PlanStep[]): Tree<T> {
        let ancestors: PlanStep[] = []
        let lastStep: PlanStep | null = null;
        let parentStep: PlanStep | null = null;

        for (let planIndex = 0; planIndex < planLiteral.length; planIndex++) {
            let currentStep: PlanStep = planLiteral[planIndex]
            if (lastStep !== null) {
              if (lastStep.depth < currentStep.depth) {
                ancestors.push(lastStep)
              } else {
                  if (lastStep.depth > currentStep.depth) {
                      for (let popIndex = 0; popIndex < currentStep.depth - lastStep.depth; popIndex++) {
                          ancestors.pop();
                      }
                  }
              }
            }

            let parentNode: Tree<T> = this.root;
            if (ancestors.length) {
                ancestors.forEach((ancestor) => {
                    let newParent = parentNode.children.find(child => child.id === ancestor.id)
                    if (newParent) {
                        parentNode = newParent
                    } else {
                        throw new Error("Couldn't find child with id '" + ancestor.id + "' in parent node " + parentNode)
                    }
                })
            }
            let newNode: Tree<T> = { id: currentStep.id, data: currentStep.data, children: [] }
            parentNode.children.push(newNode);

            lastStep = currentStep;
        }
        return this.root
    }
}

export class Ranger {
    static traverse<Data, PlanStep extends Step<Data>>(plan: PlanStep[]): Tree<Data> {
        let inspector = new PlanInspector<Data>();
        return inspector.traverse(plan);
    }
}