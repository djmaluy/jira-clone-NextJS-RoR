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
      expect(assigns(:members)).to match_array([admin_membership, member_membership])
    end
  end

  describe 'PUT #update' do
    context 'when current user is admin' do
      before do
        allow(controller).to receive(:current_user).and_return(admin_user)
      end

      context 'with valid role change' do
        it 'updates member role successfully' do
          put :update, params: { workspace_id: workspace.id, id: member_user.id, role: 'admin' }, format: :json

          expect(response).to have_http_status(:ok)
          member_membership.reload
          expect(member_membership.role).to eq('admin')
        end

        it 'does not update role when user already has the role' do
          put :update, params: { workspace_id: workspace.id, id: member_user.id, role: 'member'  }, format: :json

          expect(response).to have_http_status(:ok)
        end
      end

      context 'when trying to demote last admin' do
        it 'prevents demotion of last admin' do
          put :update, params: { workspace_id: workspace.id, id: admin_user.id, role: 'member' }, format: :json

          expect(response).to have_http_status(:unprocessable_entity)
          admin_membership.reload
          expect(admin_membership.role).to eq('admin')
        end

        it 'allows demotion when there are multiple admins' do
          create(:membership, :admin, user: regular_user, workspace: workspace)
          put :update, params: { workspace_id: workspace.id, id: admin_user.id, role: 'member' }, format: :json

          expect(response).to have_http_status(:ok)
          admin_membership.reload
          expect(admin_membership.role).to eq('member')
        end
      end

      context 'with invalid member' do
        it 'returns not found for non-existent member' do
          put :update, params: { workspace_id: workspace.id, id: 99999, role: 'admin' }, format: :json

          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context 'when current user is not admin' do
      before do
        allow(controller).to receive(:current_user).and_return(member_user)
      end

      it 'denies access to non-admin users' do
        put :update, params: { workspace_id: workspace.id, id: admin_user.id, role: 'member' }, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to eq('Access denied. Only workspace admin can manage members.')
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'when current user is admin' do
      before do
        allow(controller).to receive(:current_user).and_return(admin_user)
      end

      context 'with valid member removal' do
        it 'removes member successfully' do
          expect { delete :destroy, params: { workspace_id: workspace.id, id: member_user.id }, format: :json
          }.to change(Membership, :count).by(-1)

          expect(response).to have_http_status(:no_content)
        end
      end

      context 'when trying to remove last member' do
        let(:single_member_workspace) { create(:workspace) }
        let!(:single_membership) { create(:membership, :admin, user: admin_user, workspace: single_member_workspace) }

        before do
          allow(controller).to receive(:current_user).and_return(admin_user)
        end

        it 'prevents removal of last member' do
          expect { 
            delete :destroy, params: { workspace_id: single_member_workspace.id, id: admin_user.id }, format: :json
          }.not_to change(Membership, :count)

          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context 'with invalid member' do
        it 'returns not found for non-existent member' do
          delete :destroy, params: { 
            workspace_id: workspace.id, 
            id: 99999 
          }, format: :json

          expect(response).to have_http_status(:not_found)
          json_response = JSON.parse(response.body)
          expect(json_response['error']).to eq('Member not found in this workspace')
        end
      end
    end

    context 'when current user is not admin' do
      before do
        allow(controller).to receive(:current_user).and_return(member_user)
      end

      it 'denies access to non-admin users' do
        delete :destroy, params: { workspace_id: workspace.id, id: admin_user.id }, format: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
