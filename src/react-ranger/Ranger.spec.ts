import pkg from '../../package.json'
import { Ranger } from "./Ranger"
describe(pkg.name, () => {
    it('extract tree from plan', () => {
        let planLiteral = [
            { id: 'the-root', depth: 0, label: 'root', data: 123 },
            { id: 'the-leaf', depth: 1, label: 'leaf', data: 456 },
        ];

        let tree: any = Ranger.traverse(planLiteral);

        expect(tree.root.label).toEqual('root')
        expect(tree.root.children[0].label).toEqual('leaf')
    })
})