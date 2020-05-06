import { v4 as uuid } from 'uuid';

const times = (n: number, fn: (i: number) => void) => {
    for (let i = 0; i < n; i++) { fn(i) }
}

type Step<T> = {
    id: string
    data: T
    depth: number
    label: string
}

type NodeMeta = { folded: boolean }

type Tree<T> = {
    id: string
    data?: T
    children: Tree<T>[]
    meta?: NodeMeta
}

let emptyTree = () => { return { id: uuid(), children: [] }}

class PlanInspector<T> {
    constructor(private root: Tree<T> = emptyTree()) { }
    traverse<PlanStep extends Step<T>>(planLiteral: PlanStep[]): Tree<T>[] {
        let lastStep: PlanStep | null = null;
        let ancestors: PlanStep[] = []
        let popAncestor = () => ancestors.pop()
        const getChildByParentAndId: (parent: Tree<T>, childId: string) => Tree<T> | undefined =
            (parent, childId) => parent.children.find(child => child.id === childId)
        const visit = (planIndex: number) => {
            let currentStep: PlanStep = planLiteral[planIndex]
            if (lastStep !== null) {
                if (lastStep.depth < currentStep.depth) {
                    ancestors.push(lastStep)
                } else {
                    if (lastStep.depth >= currentStep.depth) {
                        let toPop = lastStep.depth - currentStep.depth
                        times(toPop, popAncestor)
                    }
                }
            }
            let parentNode: Tree<T> = this.root;
            if (ancestors.length) {
                ancestors.forEach((ancestor) => {
                    let relation = getChildByParentAndId(parentNode, ancestor.id)
                    if (relation) {
                        parentNode = relation;
                    } else {
                        throw new Error("Could not find intermediate ancestor with id " + ancestor.id)
                    }
                })
            }
            let newNode: Tree<T> = { id: currentStep.id, data: currentStep.data, children: [] }
            parentNode.children.push(newNode);
            lastStep = currentStep;
        }
        times(planLiteral.length, visit)
        return this.root.children
    }
}

export class Ranger {
    static traverse<Data, PlanStep extends Step<Data>>(plan: PlanStep[]): Tree<Data>[] {
        let inspector = new PlanInspector<Data>();
        return inspector.traverse(plan);
    }
}