require 'rails_helper'

RSpec.describe MembersController, type: :controller do
  let(:admin_user) { create(:user) }
  let(:regular_user) { create(:user) }
  let(:member_user) { create(:user) }
  let(:workspace) { create(:workspace) }
  
  let!(:admin_membership) { create(:membership, :admin, user: admin_user, workspace: workspace) }
  let!(:member_membership) { create(:membership, user: member_user, workspace: workspace) }

  before do
    allow(controller).to receive(:authenticate_user).and_return(true)
  end

  describe 'GET #index' do
    before do
      allow(controller).to receive(:current_user).and_return(admin_user)
    end

    it 'returns all workspace members' do
      get :index, params: { workspace_id: workspace.id }, format: :json
      
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'PUT #update' do
    before do
      allow(controller).to receive(:current_user).and_return(admin_user)
    end

    context 'when user is admin' do
      it 'successfully updates member role' do
        put :update, params: { workspace_id: workspace.id, id: member_user.id, role: 'admin' }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('Ok')
        expect(member_membership.reload.role).to eq('admin')
      end

      it 'returns error when trying to update own role' do
        patch :update, params: { workspace_id: workspace.id, id: admin_user.id, role: 'member' }

        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq('You cannot change your own role.')
      end
    end

    context 'when user is not admin' do
      before do
        allow(controller).to receive(:current_user).and_return(member_user)
      end

      it 'returns access denied error' do
        patch :update, params: { workspace_id: workspace.id, id: admin_user.id, role: 'member' }

        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq('Access denied. Only workspace admin can manage members.')
      end
    end

    context 'when update fails due to model validation' do
      before do
        allow(controller).to receive(:current_user).and_return(admin_user)
        allow_any_instance_of(Membership).to receive(:update).and_return(false)
      end

      it 'returns unprocessable_entity 422' do
        put :update, params: { workspace_id: workspace.id, id: member_user.id, role: 'admin' }

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when current user is admin' do
      before do
        allow(controller).to receive(:current_user).and_return(admin_user)
      end

      it 'removes a normal member successfully' do
        delete :destroy, params: { workspace_id: workspace.id, id: member_user.id }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('Ok')
      end

      it 'prevents removing the last member' do
        member_membership.destroy

        delete :destroy, params: { workspace_id: workspace.id, id: admin_user.id }

        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq('Cannot leave workspace. You are the last member.')
      end

      it 'prevents removing the last admin' do
        other_member = create(:membership, workspace: workspace, user: regular_user, role: 'member')

        delete :destroy, params: { workspace_id: workspace.id, id: admin_user.id }

        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq('Cannot remove the last admin from workspace.')
      end

      it 'allows admin to remove self if not last member' do
        create(:membership, workspace: workspace, user: regular_user, role: 'member')

        delete :destroy, params: { workspace_id: workspace.id, id: admin_user.id }

        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when current user is not admin' do
      before do
        allow(controller).to receive(:current_user).and_return(member_user)
      end

      it 'prevents removing another member' do
        delete :destroy, params: { workspace_id: workspace.id, id: admin_user.id }

        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq('Access denied. Only workspace admin can manage members.')
      end

      it 'prevents removing self if last member' do
        admin_membership.destroy

        delete :destroy, params: { workspace_id: workspace.id, id: member_user.id }

        expect(response).to have_http_status(:forbidden)
        expect(JSON.parse(response.body)['error']).to eq('Cannot leave workspace. You are the last member.')
      end
    end

    context 'when destroy fails due to model callback' do
      before do
        allow(controller).to receive(:current_user).and_return(admin_user)
        allow_any_instance_of(Membership).to receive(:destroy).and_return(false)
      end

      it 'returns unprocessable_entity 422' do
        delete :destroy, params: { workspace_id: workspace.id, id: member_user.id }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['error']).to eq('Failed to remove member')
      end
    end
  end
end
