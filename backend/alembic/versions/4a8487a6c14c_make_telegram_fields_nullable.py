"""make_telegram_fields_nullable

Revision ID: 4a8487a6c14c
Revises: d46c98c8de63
Create Date: 2026-06-19 23:16:10.891686

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4a8487a6c14c'
down_revision: Union[str, Sequence[str], None] = 'd46c98c8de63'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('settings', 'telegram_chat_id', existing_type=sa.String(), nullable=True)
    op.alter_column('settings', 'telegram_token_id', existing_type=sa.String(), nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('settings', 'telegram_chat_id', existing_type=sa.String(), nullable=False)
    op.alter_column('settings', 'telegram_token_id', existing_type=sa.String(), nullable=False)
