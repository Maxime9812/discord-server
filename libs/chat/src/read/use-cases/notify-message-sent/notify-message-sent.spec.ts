import { MessageSentEvent } from '@app/chat/write/domain/message/message.events'
import { StubMessageNotifier } from '../../infra/message-notifiers/stub-message-notifier'
import { NotifyMessageSent } from './notify-message-sent.handler'

describe('Feature: Notify receiver of message sent', () => {
    test('User is notifier when message is sent', async () => {
        const usecase = new NotifyMessageSent()
        const notifier = new StubMessageNotifier()

        const message = {
            id: 'message-id',
            receiverId: 'receiver-id',
            emitterId: 'emitter-id',
            content: 'Hello',
            sendAt: new Date('2021-01-01'),
        }

        await usecase.execute({
            event: new MessageSentEvent(message),
            userId: 'receiver-id',
            notifier,
        })

        expect(notifier.lastMessage).toEqual({
            id: 'message-id',
            emitterId: 'emitter-id',
            receiverId: 'receiver-id',
            content: 'Hello',
            sendAt: new Date('2021-01-01'),
        })
    })

    test('User is not notified when message is sent to another user', async () => {
        const usecase = new NotifyMessageSent()
        const notifier = new StubMessageNotifier()

        const message = {
            id: 'message-id',
            receiverId: 'another-receiver-id',
            emitterId: 'emitter-id',
            content: 'Hello',
            sendAt: new Date('2021-01-01'),
        }

        await usecase.execute({
            event: new MessageSentEvent(message),
            userId: 'receiver-id',
            notifier,
        })

        expect(notifier.lastMessage).toBeUndefined()
    })
})
