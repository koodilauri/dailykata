'use client'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '#/components/ui/dialog'
import { signIn } from '#/lib/auth-client'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  kataId: string
}

export function LoginDialog({ open, onOpenChange, kataId }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to save progress</DialogTitle>
          <DialogDescription>
            You solved it! Sign in with GitHub to save your XP and streak. Your solution will be
            submitted automatically after signing in.
          </DialogDescription>
        </DialogHeader>
        <Button
          className="w-full"
          onClick={() => signIn.social({ provider: 'github', callbackURL: `/kata/${kataId}` })}
        >
          Sign in with GitHub
        </Button>
      </DialogContent>
    </Dialog>
  )
}
