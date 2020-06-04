export namespace ActionTypeCategory {
  export const undoableActionTypes = [
    'PUSH_NEW_BAR',
    'INSERT_NEW_BAR',
    'ADD_BAR',
    'REMOVE_BAR',
    'CHANGE_BAR_BEAT',
    'ADD_NOTE',
    'REMOVE_NOTE',
    'REMOVE_NOTES_ON_BAR',
    'REMOVE_OVERFLOWED_NOTES',
    'CHANGE_NOTE_TYPE',
    'ADD_LONG_NOTE',
    'UPDATE_EDITING_LONG_NOTE',
    'FINISH_EDITING_LONG_NOTE',
    'REMOVE_LONG_NOTE',
    'REMOVE_LONG_NOTES_ON_BAR',
    'REMOVE_OVERFLOWED_LONG_NOTES',
  ] as const
}
