import pkg from '../../package.json'
import { Ranger } from "./Ranger"
describe(pkg.name, () => {
    it('extract tree from simple plan', () => {
        let planLiteral = [
            { id: 'the-parent', depth: 0, label: 'parent', data: 123 },
            { id: 'the-leaf', depth: 1, label: 'leaf', data: 456 },
        ];
        let forest = Ranger.traverse(planLiteral);
        expect(forest[0].id).toEqual('the-parent')
        expect(forest[0].children[0].id).toEqual('the-leaf')
    })

    it('extract tree from complex plan', () => {
        let planLiteral = [
            { id: 'parent-a',    depth: 0, label: 'a',     data: 123 },
            { id: 'child-one',   depth: 1, label: 'one',   data: 456 },
            { id: 'child-two',   depth: 1, label: 'two',   data: 789 },
            { id: 'parent-b',    depth: 0, label: 'a',     data: 101112 },
            { id: 'parent-c',    depth: 1, label: 'one',   data: 131415 },
            { id: 'child-three', depth: 2, label: 'three', data: 161718 },
        ];
        let forest = Ranger.traverse(planLiteral);
        expect(forest.length).toEqual(2)

        expect(forest[0].id).toEqual('parent-a')
        expect(forest[0].children[0].id).toEqual('child-one')
        expect(forest[0].children[1].id).toEqual('child-two')

        expect(forest[1].id).toEqual('parent-b')
        expect(forest[1].children[0].id).toEqual('parent-c')
        expect(forest[1].children[0].children[0].id).toEqual('child-three')
    })

    test.todo('transforms tree to list')
})