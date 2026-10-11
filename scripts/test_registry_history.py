import copy
import unittest
from registry_history import compare

class HistoryTests(unittest.TestCase):
    def setUp(self):
        self.before = {'date': '01.08.2026', 'entities': {'e': {'name': 'Publisher'}}, 'media': [
            {'id': 'R40-00001', 'names': ['A'], 'entities': ['e'], 'details': [{'row': 3, 'note': 'one'}, {'row': 4, 'note': 'two'}]}]}
        self.after = copy.deepcopy(self.before)
        self.after['date'] = '01.09.2026'

    def test_row_moves_and_order_are_not_changes(self):
        self.after['media'][0]['details'].reverse()
        self.after['media'][0]['details'][0]['row'] = 999
        self.assertEqual(compare(self.before, self.after), [])

    def test_entity_change_is_detected(self):
        self.after['entities']['e']['name'] = 'New publisher name'
        self.assertEqual(compare(self.before, self.after)[0]['fields'], ['entities'])

    def test_missing_is_not_revocation(self):
        self.after['media'] = []
        self.assertEqual(compare(self.before, self.after)[0]['kind'], 'missing')

    def test_appearance_is_observation(self):
        self.before['media'] = []
        event = compare(self.before, self.after)[0]
        self.assertEqual((event['kind'], event['from'], event['to']), ('appeared', '2026-08-01', '2026-09-01'))

if __name__ == '__main__':
    unittest.main()
